# Carl iOS Prototype

A SwiftUI-first prototype for **Carl** — a calm reflective companion built around conversation, journaling, visible memory, and flexible reflection letters.

## Product shape

This prototype translates the web language from `../carl` into an iOS-focused app structure:

- **Conversation** as the primary room
- **Journal** as a separate writing space with explicit boundaries
- **Journey** as a visible memory timeline
- **Reflection** as a flexible letter rather than a forced weekly report

## Key interaction decisions

- **Conversation-first:** Carl is primarily a thinking space, not a journal with chat bolted on.
- **Suggest before saving:** Carl can surface a memory suggestion, but it is not silently stored.
- **User-controlled memory posture:** users choose whether Carl can see all shared entries, only selected entries, or only attached entries.
- **Visible memory:** saved notes, journal items, and reflection outputs live together in a journey timeline.
- **Gentle automation:** reflection letters can be manually requested or softly suggested based on accumulation, quiet periods, or life events.

## Structure

- `CarlRootView.swift` — app shell with tab navigation
- `ConversationView.swift` — primary reflective dialogue room
- `JournalView.swift` — entries + access controls
- `JourneyView.swift` — inspectable memory timeline
- `ReflectionView.swift` — reflection letter experience
- `MemoryPreferencesView.swift` — first-use / adjustable memory posture
- `CarlStore.swift` — mock state + seeded prototype data

## Running

This is a Swift Package containing a SwiftUI app entry point and shared views. Open in Xcode for the best experience.

If you have full Xcode installed, you can create an iOS app target around these sources or open the package and preview the views.

## Design notes

Palette adapted from the website prototype:

- background `#F7F4EF`
- surface `#F1EEE8`
- sage `#B7C7B0`
- lavender `#C9C3D9`
- pale blue `#C7D9E8`
- sand `#DDD0C2`
- text `#2F3437`
- muted text `#667075`
- border `#E3DDD4`
