import SwiftUI

struct CarlRootView: View {
    @StateObject private var store = CarlStore()

    var body: some View {
        TabView(selection: $store.selectedTab) {
            NavigationStack {
                ConversationView()
                    .environmentObject(store)
            }
            .tabItem {
                Label("Conversation", systemImage: "bubble.left.and.bubble.right")
            }
            .tag(CarlTab.conversation)

            NavigationStack {
                JournalView()
                    .environmentObject(store)
            }
            .tabItem {
                Label("Journal", systemImage: "book.closed")
            }
            .tag(CarlTab.journal)

            NavigationStack {
                JourneyView()
                    .environmentObject(store)
            }
            .tabItem {
                Label("Journey", systemImage: "point.topleft.down.curvedto.point.bottomright.up")
            }
            .tag(CarlTab.journey)

            NavigationStack {
                ReflectionView()
                    .environmentObject(store)
            }
            .tabItem {
                Label("Reflection", systemImage: "envelope.open")
            }
            .tag(CarlTab.reflection)
        }
        .tint(CarlPalette.text)
        .sheet(item: $store.activeInfoTopic) { topic in
            InfoSheet(title: topic.title, text: topic.bodyText)
                .presentationDetents([.medium])
        }
        .sheet(isPresented: $store.showingImportSheet) {
            ImportView()
                .environmentObject(store)
                .presentationDetents([.medium, .large])
                .presentationDragIndicator(.visible)
        }
        .sheet(isPresented: $store.showingMemoryPreferences) {
            MemoryPreferencesView()
                .environmentObject(store)
                .presentationDetents([.medium, .large])
                .presentationDragIndicator(.visible)
        }
        .preferredColorScheme(.light)
    }
}
