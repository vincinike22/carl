import Testing
@testable import CarlApp

struct CarlLogicTests {
    @Test func responseReturnsReflectiveReplyForStayOrLeaveLanguage() {
        let response = CarlLogic.response(for: "Should I stay or leave?")
        #expect(response.contains("question is no longer only about the role itself"))
    }

    @Test func responseReturnsFallbackForGeneralPrompt() {
        let response = CarlLogic.response(for: "I feel unsettled today")
        #expect(response == "Say a little more. What feels most alive or most unsettled in this for you?")
    }

    @Test func memorySuggestionTriggersOnlyForStayOrLeave() {
        #expect(CarlLogic.shouldSuggestMemory(for: "Should I stay?") == true)
        #expect(CarlLogic.shouldSuggestMemory(for: "I need rest") == false)
    }

    @Test func journalTitleUsesTrimmedPrefix() {
        let title = CarlLogic.journalTitle(from: "   This is a deliberately long journal line for testing title truncation   ")
        #expect(title == "This is a deliberately long journ")
    }

    @Test func journeyFilterReturnsOnlyRequestedKinds() {
        let items: [JourneyItem] = [
            JourneyItem(date: "A", kind: "Carl note", title: "1", body: "1", tint: .sage),
            JourneyItem(date: "B", kind: "Journal entry", title: "2", body: "2", tint: .lavender),
            JourneyItem(date: "C", kind: "Reflection letter", title: "3", body: "3", tint: .sand)
        ]

        let filtered = CarlLogic.filterJourneyItems(items, by: .journal)
        #expect(filtered.count == 1)
        #expect(filtered.first?.kind == "Journal entry")
    }

    @Test func subtitleSystemMatchesShippingCopy() {
        #expect(CarlLogic.subtitle(for: .conversation) == "A place to think")
        #expect(CarlLogic.subtitle(for: .journal) == "A place to keep")
        #expect(CarlLogic.subtitle(for: .journey) == "A trail of thought")
        #expect(CarlLogic.subtitle(for: .reflection) == "A quiet room for reflection")
    }
}
