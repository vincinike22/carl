import SwiftUI

struct JournalView: View {
    @EnvironmentObject private var store: CarlStore

    var body: some View {
        CarlScreen(
            title: "Your words, your boundaries.",
            subtitle: "Journal in your own voice. Then decide what Carl may see — everything shared, only selected entries, or only what you attach in the moment."
        ) {
            CarlCard {
                HStack {
                    Text("Memory posture")
                        .font(.system(size: 12, weight: .medium))
                        .tracking(1.6)
                        .foregroundStyle(CarlPalette.textMuted.opacity(0.7))
                    Spacer()
                    Text(store.memoryAccessMode.rawValue)
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(CarlPalette.text)
                }

                Text(store.memoryAccessMode.description)
                    .font(.system(size: 14))
                    .foregroundStyle(CarlPalette.textMuted)
                    .lineSpacing(4)

                Button("Adjust memory preferences") {
                    store.showingMemoryPreferences = true
                }
                .font(.system(size: 14, weight: .medium))
                .foregroundStyle(CarlPalette.text)
            }

            CarlCard(tint: CarlPalette.background) {
                HStack {
                    Text("Journal")
                        .font(.system(size: 12, weight: .medium))
                        .tracking(1.6)
                        .foregroundStyle(CarlPalette.textMuted.opacity(0.7))
                    Spacer()
                    Text("\(store.entries.count) entries")
                        .font(.system(size: 12))
                        .foregroundStyle(CarlPalette.textMuted.opacity(0.5))
                }

                ForEach(store.entries.indices, id: \.self) { index in
                    if index > 0 {
                        Divider().overlay(CarlPalette.border)
                    }
                    JournalEntryRow(entry: $store.entries[index])
                }
            }

            CarlCard {
                SectionLabel(text: "Context control", tint: CarlPalette.textMuted.opacity(0.65))
                VStack(alignment: .leading, spacing: 14) {
                    ContextExplanation(access: .shared, text: "Carl can reference this entry in conversation and memory.")
                    ContextExplanation(access: .privateOnly, text: "Carl never sees this. It remains yours alone.")
                    ContextExplanation(access: .attached, text: "Shared only within a specific conversation.")
                }
            }
        }
        .navigationTitle("Journal")
    }
}

private struct JournalEntryRow: View {
    @Binding var entry: JournalEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(entry.date)
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(CarlPalette.textMuted.opacity(0.55))
                    Text(entry.title)
                        .font(.system(size: 17, weight: .light, design: .serif))
                        .foregroundStyle(CarlPalette.text)
                }
                Spacer()
                Menu {
                    ForEach(JournalAccess.allCases, id: \.self) { access in
                        Button(access.title) { entry.access = access }
                    }
                } label: {
                    AccessBadge(access: entry.access)
                }
            }

            Text(entry.preview)
                .font(.system(size: 15))
                .foregroundStyle(CarlPalette.text.opacity(0.72))
                .lineSpacing(5)
        }
        .padding(.vertical, 4)
    }
}

private struct AccessBadge: View {
    let access: JournalAccess

    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: access.systemImage)
                .font(.system(size: 10))
            Text(access.title)
                .font(.system(size: 12, weight: .medium))
        }
        .foregroundStyle(access.tint)
        .padding(.horizontal, 10)
        .padding(.vertical, 7)
        .background(Capsule().fill(access.tint.opacity(0.12)))
    }
}

private struct ContextExplanation: View {
    let access: JournalAccess
    let text: String

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: access.systemImage)
                .font(.system(size: 11))
                .foregroundStyle(access.tint)
                .frame(width: 16)
            VStack(alignment: .leading, spacing: 3) {
                Text(access.title)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundStyle(CarlPalette.text)
                Text(text)
                    .font(.system(size: 14))
                    .foregroundStyle(CarlPalette.textMuted)
            }
        }
    }
}
