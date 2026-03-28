import Testing
@testable import CarlApp

@MainActor
struct CarlStoreTests {
    @Test func sendConversationAppendsUserAndCarlMessagesAndClearsInput() {
        let store = CarlStore()
        let initialCount = store.conversationMessages.count
        store.conversationInput = "Should I stay in this role?"

        store.sendConversation()

        #expect(store.conversationMessages.count == initialCount + 2)
        #expect(store.conversationMessages[initialCount].author == .user)
        #expect(store.conversationMessages[initialCount].text == "Should I stay in this role?")
        #expect(store.conversationMessages[initialCount + 1].author == .carl)
        #expect(store.conversationInput.isEmpty)
        #expect(store.showingMemorySuggestion == true)
    }

    @Test func sendConversationIgnoresBlankInput() {
        let store = CarlStore()
        let initialCount = store.conversationMessages.count
        store.conversationInput = "   "

        store.sendConversation()

        #expect(store.conversationMessages.count == initialCount)
    }

    @Test func saveJournalEntryPrependsEntryAndClearsDraft() {
        let store = CarlStore()
        let initialCount = store.journalEntries.count
        store.selectedJournalMode = .attached
        store.journalDraft = "A fresh note for testing"

        store.saveJournalEntry()

        #expect(store.journalEntries.count == initialCount + 1)
        #expect(store.journalEntries.first?.access == "Attached")
        #expect(store.journalEntries.first?.title == "A fresh note for testing")
        #expect(store.journalDraft.isEmpty)
    }

    @Test func saveJournalEntryIgnoresEmptyDraft() {
        let store = CarlStore()
        let initialCount = store.journalEntries.count
        store.journalDraft = "   "

        store.saveJournalEntry()

        #expect(store.journalEntries.count == initialCount)
    }

    @Test func dismissMemorySuggestionHidesCard() {
        let store = CarlStore()
        store.showingMemorySuggestion = true

        store.dismissMemorySuggestion()

        #expect(store.showingMemorySuggestion == false)
    }

    @Test func filteredJourneyItemsUseSelectedFilter() {
        let store = CarlStore()
        store.selectedJourneyFilter = .reflections

        let filtered = store.filteredJourneyItems

        #expect(filtered.allSatisfy { $0.kind == "Reflection letter" })
    }
}
