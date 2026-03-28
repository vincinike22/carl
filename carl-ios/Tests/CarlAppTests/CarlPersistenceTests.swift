import Testing
@testable import CarlApp

@MainActor
struct CarlPersistenceTests {
    @Test func storeLoadsExistingSnapshotOnInit() {
        let persistence = InMemoryCarlPersistence()
        persistence.snapshot = CarlSnapshot(
            selectedJournalMode: "Attached",
            selectedReflectionRange: "Since March 1",
            selectedJourneyFilter: "Reflections",
            showingMemorySuggestion: false,
            conversationInput: "draft",
            journalDraft: "journal",
            importedItems: [ImportedItemRecord(title: "Archive", subtitle: "s", type: "Notion", shared: true)],
            conversationMessages: [ConversationItemRecord(author: "user", text: "hello")],
            journalEntries: [JournalEntryRecord(date: "Today", title: "T", preview: "P", access: "Attached")],
            journeyItems: [JourneyItemRecord(date: "Now", kind: "Reflection letter", title: "R", body: "B", tint: "sand")]
        )

        let store = CarlStore(persistence: persistence)

        #expect(store.selectedJournalMode == .attached)
        #expect(store.selectedReflectionRange == .sinceMarch1)
        #expect(store.selectedJourneyFilter == .reflections)
        #expect(store.showingMemorySuggestion == false)
        #expect(store.conversationInput == "draft")
        #expect(store.journalDraft == "journal")
        #expect(store.conversationMessages.first?.text == "hello")
        #expect(store.journalEntries.first?.access == "Attached")
        #expect(store.journeyItems.first?.kind == "Reflection letter")
    }

    @Test func storePersistsWhenStateChanges() {
        let persistence = InMemoryCarlPersistence()
        let store = CarlStore(persistence: persistence)
        store.conversationInput = "Should I stay?"

        store.sendConversation()

        #expect(persistence.snapshot != nil)
        #expect(persistence.snapshot?.conversationMessages.last?.author == "carl")
    }

    @Test func saveJournalEntryPersistsSnapshot() {
        let persistence = InMemoryCarlPersistence()
        let store = CarlStore(persistence: persistence)
        store.selectedJournalMode = .attached
        store.journalDraft = "A durable note"

        store.saveJournalEntry()

        #expect(persistence.snapshot?.journalEntries.first?.title == "A durable note")
        #expect(persistence.snapshot?.journalEntries.first?.access == "Attached")
    }
}
