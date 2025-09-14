# Raksha AI - Hybrid Triage Engine

A production-grade hybrid triage engine that fuses Gemini AI reasoning with deterministic guardrails for safe, explainable medical triage guidance.

## Overview

This system combines the reasoning capabilities of Google's Gemini AI with strict deterministic rules to provide structured, safe medical triage guidance. It's designed for Indonesia's healthcare context with seasonal considerations and local symptom terminology.

## Architecture

```
User Input → Validation → Gemini AI → Guardrails → Seasonal Prior → Final Result
```

### Components

1. **Ontology System** (`lib/triage/ontology.ts`)
   - Red flags detection
   - Symptom aliases mapping
   - Canonical conditions
   - Seasonal configuration

2. **Schema Validation** (`lib/triage/schema.ts`)
   - Input/output validation with Zod
   - Type safety
   - Error handling

3. **Gemini Integration** (`lib/triage/gemini.ts`)
   - AI reasoning with structured prompts
   - JSON-only responses
   - Timeout and retry handling

4. **API Endpoint** (`app/api/triage/route.ts`)
   - Rate limiting
   - Input validation
   - Error responses

## Setup

### Environment Variables

```bash
# Required
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# Optional
GEMINI_MODEL=gemini-1.5-pro  # Default: gemini-1.5-pro
```

### Installation

```bash
npm install @google/generative-ai p-limit
```

## API Contract

### Endpoint

```
POST /api/triage
```

### Request Schema

```typescript
{
  symptomsText: string,             // 1-2000 characters
  age?: number,                     // 0-120 years
  tempC?: number,                   // 30-45°C
  daysFever?: number,               // 0-30 days
  region?: string,                  // e.g., "Jawa Timur"
  month?: number,                   // 1-12
  diarrheaFreqPerDay?: number,      // 0-50 times
  vomitFreqPerDay?: number,         // 0-50 times
  redFlags?: {
    chestPain?: boolean,
    bleeding?: boolean,
    sob?: boolean,
    neuro?: boolean
  }
}
```

### Response Schema

#### Success Response
```typescript
{
  ok: true,
  result: {
    level: "EMERGENCY" | "CONSULT" | "SELF_CARE",
    score: number,                  // 0-100
    reasons: string[],              // Human-friendly reasoning
    seasonalContext?: string,       // Seasonal risk context
    microEducation: string[],       // Level-specific guidance
    topConditions: [                // Top 3 conditions
      {
        condition: string,
        likelihood: number,         // 0-1
        why: string
      }
    ],
    matchedKeywords: string[],      // Exact phrases from input
    reasoningLLM: string,           // AI reasoning (2-4 sentences)
    extracted: any                  // Raw Gemini response (debug)
  }
}
```

#### Error Response
```typescript
{
  ok: false,
  error: string
}
```

## Usage Examples

### Basic Triage
```bash
curl -X POST /api/triage \
  -H "Content-Type: application/json" \
  -d '{
    "symptomsText": "demam tinggi 39°C, sakit kepala, lemas",
    "age": 25,
    "tempC": 39.0
  }'
```

### GI Symptoms
```bash
curl -X POST /api/triage \
  -H "Content-Type: application/json" \
  -d '{
    "symptomsText": "mencret 7x/hari, mual, lemas, tidak demam",
    "age": 22,
    "diarrheaFreqPerDay": 7
  }'
```

### Seasonal DBD Risk
```bash
curl -X POST /api/triage \
  -H "Content-Type: application/json" \
  -d '{
    "symptomsText": "demam 38.4 dua hari, ruam, nyeri otot",
    "region": "Jawa Timur",
    "month": 2
  }'
```

### Red Flags
```bash
curl -X POST /api/triage \
  -H "Content-Type: application/json" \
  -d '{
    "symptomsText": "nyeri dada, sesak napas, suhu 39.6",
    "tempC": 39.6,
    "redFlags": {
      "chestPain": true,
      "sob": true
    }
  }'
```

## Guardrails & Safety

### Red Flags (Force EMERGENCY)
- Chest pain
- Bleeding
- Shortness of breath
- Neurological symptoms

### Temperature Escalation
- ≥39.5°C: Escalate to EMERGENCY (if with red flags) or CONSULT
- Age <2 or >65 with fever ≥38°C: Escalate to CONSULT

### GI Symptoms
- Diarrhea ≥6x/day or vomiting ≥3x/day: Minimum CONSULT

### Seasonal Prior (DBD Risk)
- Rainy months (Dec-Mar) + DBD regions + DBD symptoms
- Escalate SELF_CARE → CONSULT
- Boost DBD likelihood in differential

## Condition Canon

The system recognizes these canonical conditions:

1. **ISPA/Flu/COVID-like** - Respiratory infections
2. **DBD/Dengue** - Dengue fever (seasonal)
3. **Gastroenteritis/Diare Infeksi** - GI infections
4. **Dehidrasi** - Dehydration
5. **Infeksi Saluran Kemih (ISK)** - UTI
6. **Gastritis/Maag** - Gastritis
7. **Appendicitis (curiga)** - Suspected appendicitis
8. **Migraine/Sakit Kepala Primer** - Primary headache
9. **Alergi/URTI ringan** - Mild allergies/URTI
10. **Asma eksaserbasi** - Asthma exacerbation

## Error Handling

### Rate Limiting
- 10 requests per minute per IP
- 429 status code when exceeded

### Validation Errors
- 400 status code for invalid input
- Detailed error messages

### Service Errors
- 503 status code for model unavailability
- 504 status code for timeouts
- 500 status code for internal errors

## Testing

Run the comprehensive test suite:

```bash
npm test __tests__/triage.engine.test.ts
```

### Test Coverage
- Input validation
- Red flag detection
- Keyword extraction
- Seasonal prior application
- Integration tests with mocked Gemini responses
- Error handling scenarios

## Security & Privacy

- No PII stored or logged
- Rate limiting to prevent abuse
- Input validation and sanitization
- Secure API key handling
- Anonymous usage analytics only

## Performance

- Gemini API timeout: 12 seconds
- Retry logic: 1 retry on network errors
- Response caching: Not implemented (stateless)
- Rate limiting: 10 requests/minute per IP

## Monitoring

The system logs:
- Successful triage completions (anonymized)
- Error rates and types
- Performance metrics
- Rate limit violations

## Limitations

- Not a medical device
- Triage guidance only, not diagnosis
- Requires internet connection for Gemini API
- Indonesian language optimized
- Seasonal context limited to DBD risk

## Support

For technical issues or questions about the triage engine, please refer to the main project documentation or contact the development team.
