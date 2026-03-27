import SwiftUI

struct JourneyView: View {
    @EnvironmentObject private var store: CarlStore

    var body: some View {
        CarlScreen(
            title: "A visible memory, not a hidden one.",
            subtitle: "Your journey stays inspectable. Journal entries, saved Carl notes, and reflection letters live on the same timeline so the relationship never becomes opaque."
        ) {
            VStack(alignment: .leading, spacing: 16) {
                ForEach(Array(store.journey.enumerated()), id: \.element.id) { index, item in
                    JourneyRow(item: item, isLast: index == store.journey.count - 1)
                }
            }

            CarlCard {
                SectionLabel(text: "Why it matters", tint: CarlPalette.textMuted.opacity(0.65))
                Text("Carl’s memory is part of the experience, not a black box behind it. You can see what came from you, what Carl noticed, and what was turned into a reflection over time.")
                    .font(.system(size: 15))
                    .foregroundStyle(CarlPalette.textMuted)
                    .lineSpacing(5)
            }
        }
        .navigationTitle("Journey")
    }
}

private struct JourneyRow: View {
    let item: MemoryItem
    let isLast: Bool

    var body: some View {
        HStack(alignment: .top, spacing: 14) {
            VStack(spacing: 0) {
                Circle()
                    .fill(item.tint.opacity(0.6))
                    .frame(width: 12, height: 12)
                    .overlay(Circle().stroke(item.tint.opacity(0.25), lineWidth: 8))
                if !isLast {
                    Rectangle()
                        .fill(CarlPalette.border)
                        .frame(width: 1, height: 118)
                }
            }
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    Text(item.date)
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(CarlPalette.textMuted.opacity(0.55))
                    Spacer()
                    Text(item.kind)
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(item.tint)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(Capsule().fill(item.tint.opacity(0.14)))
                }

                CarlCard(tint: CarlPalette.surface) {
                    Text(item.title)
                        .font(.system(size: 18, weight: .light, design: .serif))
                        .foregroundStyle(CarlPalette.text)
                    Text(item.body)
                        .font(.system(size: 15))
                        .foregroundStyle(CarlPalette.text.opacity(0.72))
                        .lineSpacing(5)
                    Text(item.source)
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(CarlPalette.textMuted.opacity(0.48))
                }
            }
        }
    }
}
