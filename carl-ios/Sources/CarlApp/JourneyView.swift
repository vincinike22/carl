import SwiftUI

struct JourneyView: View {
    @EnvironmentObject private var store: CarlStore

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 18) {
                topBar(title: "Journey", subtitle: store.journeySubtitle) {
                    store.presentInfo(.journey)
                }

                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        ForEach(JourneyFilter.allCases) { filter in
                            filterPill(filter.rawValue, selected: store.selectedJourneyFilter == filter) {
                                store.selectedJourneyFilter = filter
                            }
                        }
                    }
                    .padding(.horizontal, 2)
                }

                VStack(alignment: .leading, spacing: 16) {
                    ForEach(store.filteredJourneyItems) { item in
                        timelineRow(item)
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
    private func filterPill(_ title: String, selected: Bool, action: @escaping () -> Void) -> some View {
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
    private func timelineRow(_ item: JourneyItem) -> some View {
        HStack(alignment: .top, spacing: 14) {
            ZStack {
                Circle()
                    .fill(item.tint.color.opacity(0.22))
                    .frame(width: 22, height: 22)

                Circle()
                    .fill(item.tint.color)
                    .frame(width: 8, height: 8)
            }
            .padding(.top, 14)

            CarlCard {
                HStack {
                    Text(item.date)
                        .font(.caption)
                        .foregroundStyle(.secondary)

                    Spacer()

                    chip(item.kind, tint: item.tint.color)
                }

                Text(item.title)
                    .font(.system(size: 19, weight: .light, design: .serif))
                    .foregroundStyle(CarlPalette.text)

                Text(item.body)
                    .font(.system(size: 15))
                    .foregroundStyle(CarlPalette.text.opacity(0.72))
                    .lineSpacing(2)
            }
        }
    }
}
