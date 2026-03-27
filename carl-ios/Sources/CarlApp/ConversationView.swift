import SwiftUI

struct ConversationView: View {
    @EnvironmentObject private var store: CarlStore

    var body: some View {
        CarlScreen(
            title: "A place to speak before your thoughts are formed.",
            subtitle: "Conversation is the main room. You do not need to know what you mean yet. Clarity can arrive slowly."
        ) {
            CarlCard {
                HStack {
                    Text("Conversation")
                        .font(.system(size: 12, weight: .medium))
                        .tracking(1.8)
                        .foregroundStyle(CarlPalette.textMuted.opacity(0.7))
                    Spacer()
                    Label("\(store.attachedEntriesCount) attached", systemImage: "paperclip")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(CarlPalette.lavender)
                }

                Divider().overlay(CarlPalette.border)

                VStack(alignment: .leading, spacing: 18) {
                    ForEach(store.messages) { message in
                        MessageBubble(message: message)
                        if message.id != store.messages.last?.id {
                            Rectangle()
                                .fill(CarlPalette.border)
                                .frame(width: 24, height: 1)
                        }
                    }
                }

                if store.suggestedMemory.isVisible {
                    SuggestedMemoryCard(
                        text: store.suggestedMemory.text,
                        onSave: store.saveSuggestedMemory,
                        onDismiss: store.dismissSuggestedMemory
                    )
                }

                Divider().overlay(CarlPalette.border)

                HStack(spacing: 12) {
                    Text("Write what’s on your mind…")
                        .font(.system(size: 15))
                        .foregroundStyle(CarlPalette.textMuted.opacity(0.45))
                    Spacer()
                    Image(systemName: "plus")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundStyle(CarlPalette.textMuted.opacity(0.5))
                        .frame(width: 30, height: 30)
                        .overlay(Circle().stroke(CarlPalette.border, lineWidth: 1))
                }
            }

            CarlCard(tint: CarlPalette.background) {
                SectionLabel(text: "Trust", tint: CarlPalette.textMuted.opacity(0.7))
                Text("Not a messenger. Not a chatbot. A quiet room where thinking happens out loud, nothing is lost, and nothing is saved without your awareness.")
                    .font(.system(size: 15))
                    .foregroundStyle(CarlPalette.textMuted)
                    .lineSpacing(5)
            }
        }
        .navigationTitle("Carl")
        .toolbar {
            ToolbarItem {
                Button("Memory") {
                    store.showingMemoryPreferences = true
                }
                .foregroundStyle(CarlPalette.text)
            }
        }
    }
}

private struct MessageBubble: View {
    let message: ConversationMessage

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if message.author == .carl {
                HStack(spacing: 8) {
                    Circle()
                        .fill(CarlPalette.sage.opacity(0.35))
                        .frame(width: 20, height: 20)
                        .overlay(Circle().fill(CarlPalette.sage.opacity(0.7)).frame(width: 8, height: 8))
                    Text("Carl")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(CarlPalette.textMuted.opacity(0.6))
                }
            }

            Text(message.text)
                .font(.system(size: 16, weight: message.author == .user ? .regular : .light))
                .foregroundStyle(message.author == .user ? CarlPalette.text : CarlPalette.text.opacity(0.84))
                .lineSpacing(6)
        }
    }
}

private struct SuggestedMemoryCard: View {
    let text: String
    let onSave: () -> Void
    let onDismiss: () -> Void

    var body: some View {
        CarlCard(tint: CarlPalette.background) {
            HStack(spacing: 8) {
                Circle()
                    .fill(CarlPalette.sage.opacity(0.22))
                    .frame(width: 18, height: 18)
                    .overlay(Circle().fill(CarlPalette.sage.opacity(0.65)).frame(width: 7, height: 7))
                Text("Suggested memory")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundStyle(CarlPalette.sage)
            }

            Text("“\(text)”")
                .font(.system(size: 14, weight: .regular, design: .serif))
                .foregroundStyle(CarlPalette.text.opacity(0.76))
                .lineSpacing(5)

            HStack(spacing: 10) {
                Button("Save", action: onSave)
                    .buttonStyle(.borderedProminent)
                    .tint(CarlPalette.sage.opacity(0.35))
                    .foregroundStyle(CarlPalette.text)

                Button("Edit") {}
                    .buttonStyle(.bordered)
                    .tint(CarlPalette.border)
                    .foregroundStyle(CarlPalette.textMuted)

                Button("Dismiss", action: onDismiss)
                    .buttonStyle(.plain)
                    .foregroundStyle(CarlPalette.textMuted.opacity(0.6))
            }
            .font(.system(size: 13, weight: .medium))
        }
    }
}
