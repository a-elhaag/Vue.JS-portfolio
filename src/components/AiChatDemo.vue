<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";

interface Message {
  id: number;
  text: string;
  type: "user" | "ai";
  time: string;
}

const chatStarted = ref(false);
const isMinimized = ref(false);
const currentMessage = ref("");
const messages = ref<Message[]>([]);
const isTyping = ref(false);
const unreadCount = ref(0);
const messagesContainer = ref<HTMLElement>();
const initialInput = ref<HTMLInputElement>();
const chatInput = ref<HTMLInputElement>();

let messageId = 0;

const mockAiResponses = [
  "That's a great question! Let me help you with that.",
  "I understand what you're asking. Here's what I think...",
  "Interesting point! Based on my knowledge...",
  "Let me break this down for you step by step.",
  "That's a common question, and here's the answer...",
  "Great question! Here's what you need to know...",
  "I'd be happy to help you understand this better.",
  "From my analysis, here's what I can tell you...",
  "That's a fascinating topic! Let me explain...",
  "Perfect question for learning! Here's my response...",
];

const formatTime = () => {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const addMessage = (text: string, type: "user" | "ai") => {
  messages.value.push({
    id: messageId++,
    text,
    type,
    time: formatTime(),
  });

  nextTick(() => {
    scrollToBottom();
  });
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const sendFirstMessage = async () => {
  if (!currentMessage.value.trim()) return;

  const userMessage = currentMessage.value.trim();
  currentMessage.value = "";

  // Start chat mode
  chatStarted.value = true;

  await nextTick();

  // Add user message
  addMessage(userMessage, "user");

  // Simulate AI response
  await simulateAiResponse();

  // Focus on chat input
  nextTick(() => {
    if (chatInput.value) {
      chatInput.value.focus();
    }
  });
};

const sendMessage = async () => {
  if (!currentMessage.value.trim()) return;

  const userMessage = currentMessage.value.trim();
  currentMessage.value = "";

  addMessage(userMessage, "user");

  if (isMinimized.value) {
    unreadCount.value++;
  }

  await simulateAiResponse();
};

const simulateAiResponse = async () => {
  isTyping.value = true;

  // Simulate typing delay
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 1500)
  );

  isTyping.value = false;

  const randomResponse =
    mockAiResponses[Math.floor(Math.random() * mockAiResponses.length)];
  addMessage(randomResponse, "ai");

  if (isMinimized.value) {
    unreadCount.value++;
  }
};

const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value;

  if (!isMinimized.value) {
    unreadCount.value = 0;
    nextTick(() => {
      if (chatInput.value) {
        chatInput.value.focus();
      }
      scrollToBottom();
    });
  }
};

onMounted(() => {
  // Focus on initial input when component mounts
  nextTick(() => {
    if (initialInput.value) {
      initialInput.value.focus();
    }
  });
});
</script>

<template>
  <div class="ai-chat-container">
    <!-- Minimal initial input (single pill) -->
    <div v-if="!chatStarted" class="initial-input-minimal">
      <div class="input-wrapper minimal">
        <input
          v-model="currentMessage"
          @keydown.enter="sendFirstMessage"
          type="text"
          placeholder="Ask the AI..."
          class="initial-input"
          ref="initialInput"
          aria-label="Ask the AI"
        />
        <button
          @click="sendFirstMessage"
          :disabled="!currentMessage.trim()"
          class="send-button"
          aria-label="Send first message"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22,2 15,22 11,13 2,9"></polygon>
          </svg>
        </button>
      </div>
    </div>

    <!-- Floating Chat Window -->
    <div
      v-if="chatStarted"
      :class="['chat-window', { minimized: isMinimized }]"
    >
      <!-- Chat Header -->
      <div class="chat-header" @click="toggleMinimize" aria-label="Toggle chat">
        <div class="header-content">
          <span class="chat-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 20l.9-2.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
              />
            </svg>
          </span>
          <div class="header-text">
            <h4>Assistant</h4>
            <span class="status">online</span>
          </div>
        </div>
        <button class="minimize-btn">
          <svg
            :class="{ rotated: !isMinimized }"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="18,15 12,9 6,15"></polyline>
          </svg>
        </button>
      </div>

      <!-- Chat Messages -->
      <div v-if="!isMinimized" class="chat-messages" ref="messagesContainer">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['message', message.type]"
        >
          <div class="message-content">
            <div class="message-text">{{ message.text }}</div>
            <div class="message-time">{{ message.time }}</div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="message ai typing-indicator">
          <div class="message-content">
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Input -->
      <div v-if="!isMinimized" class="chat-input-container">
        <div class="input-wrapper">
          <input
            v-model="currentMessage"
            @keydown.enter="sendMessage"
            type="text"
            placeholder="Type your message..."
            class="chat-input"
            ref="chatInput"
          />
          <button
            @click="sendMessage"
            :disabled="!currentMessage.trim()"
            class="send-button"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22,2 15,22 11,13 2,9"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Floating toggle button after first message -->
    <div v-if="chatStarted && isMinimized" class="floating-chat-icon">
      <button
        class="animated-toggle icon-only"
        @click="toggleMinimize"
        aria-label="Open chat window"
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 20l.9-2.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
          />
        </svg>
      </button>
      <div v-if="unreadCount > 0" class="notification-badge">
        {{ unreadCount }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* === Minimal Theme Adaptation (Revised) === */
.ai-chat-container {
  position: relative;
  z-index: 1000;
}

/* Initial single input (no card) */
.initial-input-minimal {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
  width: clamp(220px, 44vw, 420px);
  animation: fadeIn 0.35s ease;
}
.input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 4px 6px 4px 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}
.input-wrapper.minimal {
  box-shadow: 0 6px 24px -4px rgba(0, 0, 0, 0.08);
}
.initial-input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 10px 4px;
  font-size: 0.95rem;
  font-family: var(--font-body);
  color: var(--text);
  outline: none;
}
.initial-input::placeholder {
  color: var(--muted);
}
.send-button {
  background: var(--text);
  color: var(--bg);
  border: none;
  border-radius: 999px;
  padding: 10px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s, transform 0.18s;
}
.send-button:hover:not(:disabled) {
  background: var(--glow);
  transform: translateY(-1px);
}
.send-button:active:not(:disabled) {
  transform: translateY(0);
}
.send-button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* Chat Window */
.chat-window {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 340px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(14px) saturate(1.2);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 8px 34px -4px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  transition: height 0.25s ease, width 0.25s ease, transform 0.25s ease;
  animation: riseIn 0.35s ease;
  font-family: var(--font-body);
}
.chat-window.minimized {
  height: 54px;
}

.chat-header {
  background: transparent;
  border-bottom: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}
.header-content {
  display: flex;
  align-items: center;
  gap: 10px;
}
.chat-icon {
  display: inline-flex;
}
.header-text h4 {
  margin: 0;
  font-size: 0.85rem;
  font-family: var(--font-heading);
  font-weight: 600;
}
.status {
  font-size: 0.65rem;
  color: var(--muted);
}
.minimize-btn {
  background: transparent;
  border: none;
  color: var(--muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
}
.minimize-btn:hover {
  background: rgba(0, 0, 0, 0.04);
  color: var(--text);
}
.minimize-btn svg {
  transition: transform 0.2s ease;
}
.minimize-btn svg.rotated {
  transform: rotate(180deg);
}

/* Messages */
.chat-messages {
  height: 280px;
  overflow-y: auto;
  padding: 18px 16px 14px;
  background: transparent;
}
.message {
  margin-bottom: 14px;
  display: flex;
}
.message.user {
  justify-content: flex-end;
}
.message.ai {
  justify-content: flex-start;
}
.message-content {
  max-width: 78%;
  padding: 10px 14px;
  border-radius: 16px;
  position: relative;
  font-size: 0.8rem;
  line-height: 1.35;
  letter-spacing: 0.2px;
  backdrop-filter: blur(2px);
}
.message.user .message-content {
  background: rgba(17, 17, 17, 0.9);
  color: var(--bg);
  border-bottom-right-radius: 4px;
}
.message.ai .message-content {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid var(--border);
  color: var(--text);
  border-bottom-left-radius: 4px;
}
.message-time {
  margin-top: 4px;
  font-size: 0.55rem;
  opacity: 0.55;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: var(--font-heading);
}
.message.ai .message-time {
  text-align: left;
}
.message.user .message-time {
  text-align: right;
}

/* Typing */
.typing-indicator .message-content {
  display: flex;
}
.typing-dots {
  display: flex;
  gap: 4px;
}
.typing-dots span {
  width: 5px;
  height: 5px;
  background: var(--muted);
  border-radius: 50%;
  animation: dot 1.2s infinite ease-in-out;
}
.typing-dots span:nth-child(2) {
  animation-delay: 0.15s;
}
.typing-dots span:nth-child(3) {
  animation-delay: 0.3s;
}

/* Input (active chat) */
.chat-input-container {
  border-top: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
  padding: 10px 14px 12px;
  background: transparent;
  backdrop-filter: blur(6px);
}
.chat-input-container .input-wrapper {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 2px 6px 2px 14px;
}
.chat-input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 10px 4px;
  font-size: 0.8rem;
  font-family: var(--font-body);
  color: var(--text);
  outline: none;
}
.chat-input::placeholder {
  color: var(--muted);
}
.chat-input-container .send-button {
  padding: 8px 12px;
}
.chat-input-container .send-button svg {
  width: 18px;
  height: 18px;
}

/* Floating Icon (animated style mimic) */
.floating-chat-icon {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1001;
  animation: fadeIn 0.35s ease;
  display: flex;
  align-items: center;
}
.animated-toggle {
  background: var(--text);
  color: var(--bg);
  border: 1px solid var(--text);
  font-family: var(--font-heading);
  padding: 0.8rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.25s, color 0.25s, box-shadow 0.25s;
}
.animated-toggle.icon-only svg {
  display: block;
}
.animated-toggle:hover {
  background: var(--glow);
  color: var(--bg);
  box-shadow: 0 0 0.9rem 0.15rem
    color-mix(in srgb, var(--glow) 55%, transparent);
}
.animated-toggle:focus-visible {
  outline: 2px solid var(--glow);
  outline-offset: 2px;
}
.notification-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: var(--glow);
  color: var(--bg);
  border-radius: 14px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.55rem;
  font-family: var(--font-heading);
  padding: 0 4px;
  box-shadow: 0 0 0 2px var(--surface);
}

/* Scrollbar */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}
.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}
.chat-messages::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}
.chat-messages::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--border) 70%, var(--text));
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes riseIn {
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes dot {
  0%,
  60%,
  100% {
    transform: scale(1);
    opacity: 0.45;
  }
  30% {
    transform: scale(1.35);
    opacity: 1;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .initial-input-minimal {
    width: calc(100vw - 48px);
    left: 50%;
  }
  .chat-window {
    right: 12px;
    left: 12px;
    width: auto;
  }
  .chat-messages {
    height: 55vh;
  }
  .floating-chat-icon {
    right: 14px;
    bottom: 14px;
  }
}
</style>
