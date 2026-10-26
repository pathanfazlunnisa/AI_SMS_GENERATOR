package com.example.contentgenerator;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class ContentController {
    public record GenerateRequest(String campaignType, String tone, boolean limitSegments,
                                  boolean includeEmoji, String prompt) {}
    public record Variant(String title, String content, String angle) {}

    @PostMapping("/generate")
    public Map<String, Object> generate(@RequestBody GenerateRequest request) {
        String prompt = request.prompt() == null ? "" : request.prompt().trim();
        if (prompt.isBlank() || prompt.equals("[object Object]")) {
            return Map.of("error", "Please enter a prompt describing the content you want.");
        }
        String campaign = safe(request.campaignType(), "Promotional");
        String tone = safe(request.tone(), "Friendly").toLowerCase(Locale.ROOT);
        String clean = prompt.replaceAll("\\s+", " ");
        String emoji = request.includeEmoji() ? " ✨" : "";
        String[] openers = switch (tone) {
            case "professional" -> new String[]{"Discover how", "We are pleased to share", "Make the most of"};
            case "energetic" -> new String[]{"Ready to go?", "It's your moment to", "Let's make it happen:"};
            default -> new String[]{"Good news!", "Here's something you'll love:", "Just for you:"};
        };
        String[] angles = {"Clear and direct", "Benefit-led", "Action-oriented"};
        List<Variant> variants = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            String content = openers[i] + " " + lowerFirst(clean) + (i == 0 ? "." : "!");
            if (campaign.equalsIgnoreCase("Reminder")) content = new String[]{"A quick reminder: ", "Don't forget: ", "Friendly reminder: "}[i] + clean + (i == 1 ? "!" : ".");
            if (campaign.equalsIgnoreCase("Announcement")) content = new String[]{"Big news: ", "We're excited to announce: ", "It's official: "}[i] + clean + "!";
            if (campaign.equalsIgnoreCase("Event")) content = new String[]{"Save the date: ", "You're invited: ", "Join us for: "}[i] + clean + "!";
            if (request.limitSegments()) content = shorten(content, 9);
            variants.add(new Variant("Variant " + (i + 1), content + emoji, angles[i]));
        }
        return Map.of("variants", variants);
    }

    private static String safe(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
    private static String lowerFirst(String value) {
        return value.isEmpty() ? value : value.substring(0, 1).toLowerCase(Locale.ROOT) + value.substring(1);
    }
    private static String shorten(String text, int maxWords) {
        String[] words = text.split("\\s+");
        if (words.length <= maxWords) return text;
        return String.join(" ", Arrays.copyOf(words, maxWords - 1)) + "…";
    }
}
