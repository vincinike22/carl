# Carl

## Tagline
A quiet room for the thoughts you are not ready to say out loud yet.

## What it is
Carl is a private reflective companion that helps people think more honestly, not more noisily. It combines AI conversation, journaling, visible memory, and reflection letters into one psychologically literate space.

## Problem
Most AI tools are optimized for fast answers. But many real human questions are not answer problems. They are reflection problems. When someone is caught in uncertainty, identity conflict, grief, transition, or recurring emotional patterns, generic AI chat often feels shallow and forgettable.

## Solution
Carl creates a calmer, more intentional space for unfinished thoughts.

It has four connected spaces:
- **Conversation** — write before thoughts are fully formed, receive reflective feedback
- **Journal** — private, shared, or attached entries with explicit boundaries
- **Journey** — a visible timeline of journal entries, Carl notes, and reflections
- **Reflection** — slower synthesis across time, not just one-off replies

## Why it is different
Carl is not just a chatbot with nicer copy. It is built around:
- reflective depth instead of answer speed
- visible memory instead of black-box memory
- privacy controls that the user can inspect
- a premium, calm interface designed to support thinking

## Tech
- SwiftUI frontend
- modular app architecture with refactored store/models/views
- tested core logic with unit tests
- backend deployed on VPS
- OpenRouter integration using `stepfun/step-3.5-flash:free`
- in-memory per-user session history via UUID

## What we shipped
- functioning frontend with four core surfaces
- refactored shipping architecture
- persistence in the app layer
- backend service deployed and running on VPS
- frontend prepared to connect conversation input to live backend replies

## Vision
Carl is a reflective operating system for the inner life: a product for people who want more clarity, pattern recognition, and emotional honesty over time.
