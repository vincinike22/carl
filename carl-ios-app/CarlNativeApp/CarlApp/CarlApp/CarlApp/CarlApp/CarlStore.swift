import SwiftUI

final class CarlStore: ObservableObject {
    @Published var selectedTab: CarlTab = .conversation
    @Published var showingMemoryPreferences = true
    @Published var memoryAccessMode: MemoryAccessMode = .selectedOnly
    @Published var reflectionAutomationEnabled = true
    @Published var messages: [ConversationMessage] = [
        .init(author: .user, text: "I keep circling back to the same question — whether I should stay in this role or try something new. I thought I'd resolved it, but it came up again today."),
        .init(author: .carl, text: "You've brought this up three times in the last month. Each time, the framing shifts slightly. The first time it was about boredom. Then it was about fear. Today it sounds more like grief — like you're mourning a version of yourself that took the other path."),
        .init(author: .user, text: "That's… actually right. I hadn't seen it that way."),
        .init(author: .carl, text: "You don't have to resolve it right now. But it might be worth noticing that each time this surfaces, your language gets more honest. That's not indecision — that's clarity arriving slowly.")
    ]
    @Published var suggestedMemory = SuggestedMemory(
        text: "The recurring question about staying vs. leaving has shifted from a practical dilemma toward an identity question. Each revisit brings more emotional honesty.",
        isVisible: true
    )
    @Published var entries: [JournalEntry] = [
        .init(date: "March 24", title: "The anxiety is not the real thing", preview: "I realized today that the anxiety isn't about the decision itself. It's about what choosing would force me to admit.", access: .shared),
        .init(date: "March 20", title: "A quiet morning", preview: "A strange quiet morning. I felt something shift but I can't name it yet.", access: .privateOnly),
        .init(date: "March 17", title: "After the conversation with M.", preview: "Conversation with M. left me thinking about what I actually want from this part of my life.", access: .attached)
    ]
    @Published var journey: [MemoryItem] = [
        .init(date: "Mar 27", kind: "Reflection letter", title: "Thirty days of reckoning", body: "Carl surfaced a slow shift from urgency into honesty, with a recurring tension between stability and freedom.", tint: CarlPalette.sand, source: "Generated across custom 30-day range"),
        .init(date: "Mar 23", kind: "Suggested memory", title: "Pattern around leaving", body: "Freedom vs. stability has appeared in four conversations since early March, moving from practical trade-offs toward identity.", tint: CarlPalette.sage, source: "Suggested from conversation"),
        .init(date: "Mar 21", kind: "Journal entry", title: "I want stillness now", body: "Silence used to feel like lack. Lately it feels like something I am choosing.", tint: CarlPalette.lavender, source: "Shared with Carl"),
        .init(date: "Mar 18", kind: "Carl note", title: "Work language softening", body: "Your language around work has become less reactive: fewer qualifiers, longer sentences, less hedging.", tint: CarlPalette.paleBlue, source: "Saved after user review")
    ]
    @Published var reflectionSections: [ReflectionSection] = [
        .init(title: "Recurring themes", body: "The question of staying versus leaving — in work, in relationships, in the city — has been the central thread. Early on it felt like restlessness. More recently, it reads as a slow reckoning with what you actually need versus what you think you should want.", tint: CarlPalette.sage),
        .init(title: "Noticeable shifts", body: "Your tone has changed. In the first week, you were writing quickly, in fragments — almost as if trying to outrun the thought. By mid-month, your entries became slower and more spacious.", tint: CarlPalette.lavender),
        .init(title: "Unresolved tensions", body: "There's a gap between how you talk about your work to others and how you describe it here. In conversation, you call it fine. In your journal, you wrote: 'I feel like I'm disappearing into it.'", tint: CarlPalette.sand),
        .init(title: "A question to sit with", body: "What would it look like to make a choice not because you've resolved every doubt, but because you trust yourself to adjust once you're in motion?", tint: CarlPalette.paleBlue)
    ]

    var attachedEntriesCount: Int {
        entries.filter { $0.access == .attached }.count
    }

    func saveSuggestedMemory() {
        journey.insert(
            .init(
                date: "Today",
                kind: "Carl note",
                title: "New saved pattern",
                body: suggestedMemory.text,
                tint: CarlPalette.sage,
                source: "Saved from conversation suggestion"
            ),
            at: 0
        )
        suggestedMemory.isVisible = false
    }

    func dismissSuggestedMemory() {
        suggestedMemory.isVisible = false
    }
}
