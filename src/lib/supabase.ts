import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = "https://wbwoqzqkzryiexfngfsk.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indid29xenFrenJ5aWV4Zm5nZnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NDA5OTYsImV4cCI6MjA1MDUxNjk5Nn0.g0FCZf2_7-hcs9E924kycm8enBZlTDFPe85hkYIcH7o";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
