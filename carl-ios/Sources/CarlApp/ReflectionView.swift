import SwiftUI

struct ReflectionView: View {
    @EnvironmentObject private var store: CarlStore

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 18) {
                topBar(title: "Reflection", subtitle: store.reflectionSubtitle) {
                    store.presentInfo(.reflection)
                }

                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        ForEach(ReflectionRange.allCases) { range in
                            reflectionRangePill(range.rawValue, selected: store.selectedReflectionRange == range) {
                                store.selectedReflectionRange = range
                            }
                        }
                    }
                    .padding(.horizontal, 2)
                }

                CarlCard {
                    VStack(alignment: .leading, spacing: 18) {
                        HStack(spacing: 10) {
                            MascotSeal(size: 28)

                            VStack(alignment: .leading, spacing: 2) {
                                Text("Reflection Letter")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)

                                Text("February 25 to March 27, 2026")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                        }

                        divider

                        reflectionBlock(
                            title: "Recurring themes",
                            body: "The question of staying versus leaving has been the central thread. Early on it felt like restlessness. More recently, it reads as a slow reckoning with what you actually need versus what you think you should want.",
                            tint: CarlPalette.sage
                        )

                        divider

                        reflectionBlock(
                            title: "Noticeable shifts",
                            body: "Your tone has changed. In the first week, you were writing quickly, in fragments. By mid-month, your entries became slower and more spacious.",
                            tint: CarlPalette.lavender
                        )

                        divider

                        reflectionBlock(
                            title: "A question to sit with",
                            body: "What would it look like to make a choice not because you have resolved every doubt, but because you trust yourself to adjust once you are in motion?",
                            tint: CarlPalette.paleBlue,
                            serif: true
                        )

                        HStack {
                            Spacer()
                            Button {
                            } label: {
                                Text("Generate again")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundStyle(CarlPalette.text)
                                    .padding(.horizontal, 16)
                                    .padding(.vertical, 10)
                                    .background(CarlPalette.sand.opacity(0.28))
                                    .clipShape(Capsule())
                            }
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
    private func reflectionRangePill(_ title: String, selected: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(title)
                .font(.caption)
                .foregroundStyle(selected ? CarlPalette.text : .secondary)
                .padding(.horizontal, 14)
                .padding(.vertical, 8)
                .background(selected ? CarlPalette.surface : Color.clear)
                .overlay(
                    Capsule()
                        .stroke(selected ? CarlPalette.text.opacity(0.16) : Color.secondary.opacity(0.16), lineWidth: 1)
                )
                .clipShape(Capsule())
        }
        .buttonStyle(.plain)
    }

    @ViewBuilder
    private func labelRow(_ value: String, tone: Color) -> some View {
        Text(value.uppercased())
            .font(.caption)
            .tracking(0.8)
            .foregroundStyle(tone)
    }

    @ViewBuilder
    private func reflectionBlock(title: String, body: String, tint: Color, serif: Bool = false) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            labelRow(title, tone: tint)

            Text(body)
                .font(.system(size: serif ? 19 : 15, weight: .light, design: serif ? .serif : .default))
                .foregroundStyle(CarlPalette.text.opacity(serif ? 0.9 : 0.74))
                .lineSpacing(serif ? 4 : 2)
        }
    }

    private var divider: some View {
        Rectangle()
            .fill(Color.secondary.opacity(0.16))
            .frame(height: 1)
    }
}
