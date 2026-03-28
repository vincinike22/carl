import SwiftUI

struct CarlCard<Content: View>: View {
    @ViewBuilder let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            content
        }
        .padding(18)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 28, style: .continuous)
                .fill(CarlPalette.surface)
                .overlay(
                    RoundedRectangle(cornerRadius: 28, style: .continuous)
                        .stroke(Color.white.opacity(0.45), lineWidth: 1)
                )
        )
        .shadow(color: Color.black.opacity(0.03), radius: 16, y: 8)
    }
}

struct InfoSheet: View {
    let title: String
    let text: String

    var body: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 16) {
                Text(title)
                    .font(.system(size: 28, weight: .light, design: .serif))

                Text(text)
                    .font(.system(size: 16))
                    .foregroundStyle(.secondary)
                    .lineSpacing(3)

                Spacer()
            }
            .padding(24)
        }
    }
}

struct MascotSeal: View {
    var size: CGFloat = 24

    var body: some View {
        ZStack {
            Circle()
                .fill(CarlPalette.sand.opacity(0.96))
                .frame(width: size, height: size)

            Circle()
                .stroke(CarlPalette.sage.opacity(0.50), lineWidth: max(1, size * 0.08))
                .frame(width: size * 0.92, height: size * 0.92)

            Circle()
                .stroke(CarlPalette.text.opacity(0.40), lineWidth: max(1, size * 0.035))
                .frame(width: size * 0.34, height: size * 0.34)
                .offset(x: -size * 0.12, y: -size * 0.03)

            Circle()
                .stroke(CarlPalette.text.opacity(0.40), lineWidth: max(1, size * 0.035))
                .frame(width: size * 0.34, height: size * 0.34)
                .offset(x: size * 0.12, y: -size * 0.03)

            Rectangle()
                .fill(CarlPalette.text.opacity(0.40))
                .frame(width: size * 0.12, height: max(1, size * 0.025))
                .offset(y: -size * 0.03)

            Path { path in
                path.move(to: CGPoint(x: size * 0.30, y: size * 0.63))
                path.addQuadCurve(
                    to: CGPoint(x: size * 0.70, y: size * 0.63),
                    control: CGPoint(x: size * 0.50, y: size * 0.76)
                )
            }
            .stroke(CarlPalette.text.opacity(0.38), lineWidth: max(1, size * 0.04))
            .frame(width: size, height: size)
        }
        .shadow(color: CarlPalette.sage.opacity(0.08), radius: 8, y: 4)
    }
}
