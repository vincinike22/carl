import Testing
@testable import CarlApp

struct CarlComposerLogicTests {
    @Test func responsePrefersIdentityPromptForStayOrLeaveLanguage() {
        let response = CarlComposerLogic.response(for: "Should I stay or leave?")
        #expect(response.contains("question is no longer only about the role itself"))
    }

    @Test func responseFallsBackToOpenPromptForGenericInput() {
        let response = CarlComposerLogic.response(for: "I feel a bit unsettled")
        #expect(response == "Say a little more. What feels most alive or most unsettled in this for you?")
    }

    @Test func memorySuggestionOnlyTriggersForStayOrLeaveLanguage() {
        #expect(CarlComposerLogic.shouldSuggestMemory(for: "Should I stay?") == true)
        #expect(CarlComposerLogic.shouldSuggestMemory(for: "I feel reflective today") == false)
    }

    @Test func journalTitleUsesTrimmedPrefix() {
        let title = CarlComposerLogic.title(forJournalDraft: "   This is a deliberately long journal line that should be shortened   ")
        #expect(title == "This is a deliberately long journa")
    }
}
