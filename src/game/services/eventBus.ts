// ============================================================================
// গ্লোবাল ইভেন্ট বাস (Global Event Bus Service)
// ফেজার গেম সিন (Phaser Game Scene) এবং রিঅ্যাক্ট কম্পোনেন্টগুলোর (React UI)
// মধ্যে পারস্পরিক বার্তা ও ডেটা আদান-প্রদানের জন্য পাব-সাব (Pub/Sub) সিস্টেম।
// ============================================================================

export type EventCallback = (...args: any[]) => void;

class EventBus {
  // ইভেন্ট নাম অনুযায়ী লিসেনার ফাংশনগুলোর সেট সংরক্ষণ করে
  private listeners: Map<string, Set<EventCallback>> = new Map();

  /**
   * নির্দিষ্ট ইভেন্টের জন্য লিসেনার রেজিস্টার বা সাবস্ক্রাইব করে
   */
  public on(event: string, callback: EventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  /**
   * রেজিস্টার করা লিসেনার আনসাবস্ক্রাইব বা রিমুভ করে
   */
  public off(event: string, callback: EventCallback): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(callback);
    }
  }

  /**
   * কোনো ইভেন্ট ট্রিগার/ইমিট করে এবং সংশ্লিষ্ট সমস্ত লিসেনারকে কল করে
   */
  public emit(event: string, ...args: any[]): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach((cb) => {
        try {
          cb(...args);
        } catch (e) {
          console.error(`Error in event listener for ${event}:`, e);
        }
      });
    }
  }

  /**
   * সমস্ত ইভেন্ট লিসেনার মুছে ফেলে মেমোরি ক্লিন করে
   */
  public clear(): void {
    this.listeners.clear();
  }
}

// গেম জুড়ে ব্যবহারের জন্য একক ইনস্ট্যান্স (Singleton Instance)
export const gameEvents = new EventBus();
