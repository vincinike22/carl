import SwiftUI

struct ConversationView: View {
    @EnvironmentObject private var store: CarlStore

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 18) {
                topBar(title: "Carl", subtitle: store.conversationSubtitle) {
                    store.presentInfo(.conversation)
                }

                CarlCard {
                    VStack(alignment: .leading, spacing: 14) {
                        labelRow("Write", tone: .secondary)

                        TextEditor(text: $store.conversationInput)
                            .frame(minHeight: 126)
                            .scrollContentBackground(.hidden)
                            .padding(12)
                            .background(CarlPalette.background)
                            .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
                            .overlay(alignment: .topLeading) {
                                if store.conversationInput.isEmpty {
                                    Text("Write what is on your mind...")
                                        .foregroundStyle(.secondary)
                                        .padding(.leading, 18)
                                        .padding(.top, 20)
                                }
                            }

                        HStack {
                            HStack(spacing: 10) {
                                softIcon(systemName: "mic.fill", tint: CarlPalette.sand)
                                softIcon(systemName: "paperclip", tint: CarlPalette.lavender)
                            }

                            Spacer()

                            Button {
                                store.sendConversation()
                            } label: {
                                Text("Send")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundStyle(CarlPalette.text)
                                    .padding(.horizontal, 18)
                                    .padding(.vertical, 11)
                                    .background(CarlPalette.sage.opacity(0.34))
                                    .clipShape(Capsule())
                            }
                        }
                    }
                }

                CarlCard {
                    VStack(alignment: .leading, spacing: 12) {
                        labelRow("Context", tone: .secondary)

                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 10) {
                                chip("Shared memory on", tint: CarlPalette.sage)
                                chip("March 17 attached", tint: CarlPalette.lavender)
                                chip("Reflection letters enabled", tint: CarlPalette.sand)
                            }
                        }
                    }
                }

                CarlCard {
                    VStack(alignment: .leading, spacing: 18) {
                        HStack {
                            labelRow("Conversation", tone: .secondary)
                            Spacer()
                            chip("1 journal attached", tint: CarlPalette.lavender)
                        }

                        ForEach(store.conversationMessages) { message in
                            conversationBubble(message)
                            if message.id != store.conversationMessages.last?.id {
                                divider
                            }
                        }

                        if store.showingMemorySuggestion {
                            memorySuggestionCard
                        }
                    }
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 12)
            .padding(.bottom, 34)
        }
        .background(CarlPalette.background.ignoresSafeArea())
    }

    private var memorySuggestionCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 8) {
                MascotSeal(size: 24)
                Text("Suggested memory")
                    .font(.caption)
                    .foregroundStyle(CarlPalette.sage)
            }

            Text("The recurring question about staying or leaving has shifted from a practical dilemma into an identity question.")
                .font(.system(size: 15, weight: .light, design: .serif))
                .foregroundStyle(CarlPalette.text.opacity(0.78))

            HStack(spacing: 10) {
                miniButton("Save", filled: true)
                miniButton("Edit", filled: false)

                Button {
                    store.dismissMemorySuggestion()
                } label: {
                    Text("Dismiss")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            .padding(.top, 2)
        }
        .padding(16)
        .background(CarlPalette.background)
        .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
    }

    @ViewBuilder
    private func topBar(title: String, subtitle: String, infoAction: @escaping () -> Void) -> some View {
        HStack(alignment: .center) {
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 30, weight: .light, design: .serif))
                    .foregroundStyle(CarlPalette.text)

                Text(subtitle)
                    .font(.system(size: 13))
                    .foregroundStyle(.secondary)
            }

            Spacer()

            Button(action: infoAction) {
                Image(systemName: "info.circle")
                    .font(.system(size: 18, weight: .medium))
                    .foregroundStyle(CarlPalette.text.opacity(0.75))
                    .frame(width: 34, height: 34)
                    .background(CarlPalette.elevated)
                    .clipShape(Circle())
            }
            .buttonStyle(.plain)
        }
    }

    @ViewBuilder
    private func labelRow(_ value: String, tone: Color) -> some View {
        Text(value.uppercased())
            .font(.caption)
            .tracking(0.8)
            .foregroundStyle(tone)
    }

    @ViewBuilder
    private func chip(_ title: String, tint: Color) -> some View {
        Text(title)
            .font(.caption)
            .foregroundStyle(tint)
            .padding(.horizontal, 11)
            .padding(.vertical, 7)
            .background(tint.opacity(0.16))
            .clipShape(Capsule())
    }

    @ViewBuilder
    private func miniButton(_ title: String, filled: Bool) -> some View {
        Text(title)
            .font(.caption)
            .foregroundStyle(filled ? CarlPalette.text : .secondary)
            .padding(.horizontal, 12)
            .padding(.vertical, 7)
            .background(filled ? CarlPalette.sage.opacity(0.22) : Color.clear)
            .overlay(
                Capsule()
                    .stroke(filled ? Color.clear : Color.secondary.opacity(0.2), lineWidth: 1)
            )
            .clipShape(Capsule())
    }

    @ViewBuilder
    private func softIcon(systemName: String, tint: Color) -> some View {
        Image(systemName: systemName)
            .font(.system(size: 13, weight: .medium))
            .foregroundStyle(CarlPalette.text.opacity(0.74))
            .frame(width: 36, height: 36)
            .background(tint.opacity(0.22))
            .clipShape(Circle())
    }

    @ViewBuilder
    private func conversationBubble(_ message: ConversationItem) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            if message.author == .carl {
                HStack(spacing: 8) {
                    MascotSeal(size: 24)
                    Text("Carl")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }

            Text(message.text)
                .font(.system(size: 16, weight: message.author == .user ? .regular : .light, design: message.author == .carl ? .serif : .default))
                .foregroundStyle(message.author == .user ? CarlPalette.text : CarlPalette.text.opacity(0.84))
                .lineSpacing(2)
        }
    }

    private var divider: some View {
        Rectangle()
            .fill(Color.secondary.opacity(0.16))
            .frame(height: 1)
    }
}
