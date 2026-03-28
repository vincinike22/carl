# Carl notes - 2026-03-28

- Recovered latest known Carl SwiftUI state as `carl-recovered/Carl_v3_1_Recovered.swift`.
- Built refined follow-up as `carl-recovered/Carl_v3_2_Refined.swift`.
- Built ship-facade iteration as `carl-recovered/Carl_v4_ShipFacade.swift`.
- Refactored `carl-ios` into a cleaner modular architecture with store-driven screen state and added unit tests for core logic in `Tests/CarlAppTests/`.
- Built `carl-recovered/Carl_v4_1_ThinkingFacade.swift` and then removed the recurring glyph idea in `carl-recovered/Carl_v4_2_NoThinkingGlyph.swift`.
- User selected a simplified frontend as the shipping baseline; saved as `carl-recovered/Carl_v5_ShippingBaseline.swift`.
- Refined top-bar subtitle system for shipping voice in `carl-recovered/Carl_v5_2_SubtitleSystem.swift`.
- Ported the chosen shipping frontend into the modular `carl-ios` structure and added persistence with snapshot-backed storage plus persistence tests.
- User preference: after the user gives feedback on Carl design/code versions, automatically save a recovery snapshot to disk so code is not lost again.
- User preference: save meaningful Carl versions in git as commits as well.
