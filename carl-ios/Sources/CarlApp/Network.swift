import Foundation

enum CarlAPIError: Error {
    case invalidResponse
    case backend(String)
}

struct CarlChatRequest: Codable {
    let userId: String
    let message: String
}

struct CarlChatResponse: Codable {
    let reply: String
    let userId: String
    let model: String
}

final class CarlAPIClient {
    let baseURL: URL
    let session: URLSession

    init(baseURL: URL = URL(string: "http://89.167.5.112:8787")!, session: URLSession = .shared) {
        self.baseURL = baseURL
        self.session = session
    }

    func sendMessage(userId: String, message: String) async throws -> CarlChatResponse {
        let url = baseURL.appendingPathComponent("chat")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(CarlChatRequest(userId: userId, message: message))

        let (data, response) = try await session.data(for: request)
        guard let http = response as? HTTPURLResponse else { throw CarlAPIError.invalidResponse }
        guard (200..<300).contains(http.statusCode) else {
            let text = String(data: data, encoding: .utf8) ?? "Unknown backend error"
            throw CarlAPIError.backend(text)
        }
        return try JSONDecoder().decode(CarlChatResponse.self, from: data)
    }
}
