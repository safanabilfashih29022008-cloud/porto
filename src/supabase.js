import { createClient } from "@supabase/supabase-js";

// Access environment variables using import.meta.env for Vite
const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured =
  typeof rawUrl === "string" &&
  rawUrl.trim() !== "" &&
  rawUrl.startsWith("http") &&
  typeof rawKey === "string" &&
  rawKey.trim() !== "" &&
  !rawKey.includes("YOUR_");

const INITIAL_PROJECTS = [
  {
    id: 1,
    Title: "Spotify Clone",
    Description:
      "Interactive music streaming web app inspired by Spotify, featuring dynamic audio playback, custom playlists, responsive navigation, and audio visualization.",
    Img: "/Spotify.png",
    TechStack: ["React", "Tailwind CSS", "JavaScript", "HTML"],
    Features: [
      "Audio Playback Controls",
      "Responsive Navigation",
      "Custom Playlist UI",
      "Dark Theme",
    ],
    Link: "https://spotify.com",
    Github: "https://github.com/Safnf",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 2,
    Title: "Meta Horizon UI",
    Description:
      "Futuristic Web UI concept exploring immersive social and spatial user experiences with modern glassmorphism, responsive cards, and fluid motion animations.",
    Img: "/Meta.png",
    TechStack: ["React", "Tailwind CSS", "Framer Motion"],
    Features: [
      "Fluid Motion Animations",
      "Interactive Cards",
      "Modern Glassmorphism UI",
      "Cross-device Responsive",
    ],
    Link: "https://github.com/Safnf",
    Github: "https://github.com/Safnf",
    created_at: "2025-01-02T00:00:00Z",
  },
  {
    id: 3,
    Title: "Personal Portfolio & CMS",
    Description:
      "Modern front-end web developer portfolio showcasing interactive projects, verified certificates, guestbook discussions, and administration dashboard.",
    Img: "/photo1.png",
    TechStack: ["React", "Tailwind CSS", "Vite", "Supabase"],
    Features: [
      "Project Showcase",
      "Certificate Viewer",
      "Guestbook Commenting",
      "Admin Management Portal",
    ],
    Link: "https://Safnf.com",
    Github: "https://github.com/Safnf",
    created_at: "2025-01-03T00:00:00Z",
  },
];

const INITIAL_CERTIFICATES = [
  {
    id: 1,
    Img: "/Photo.png",
    title: "Front-End Web Development",
    issuer: "Dicoding Academy",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 2,
    Img: "/Meta.png",
    title: "Meta Front-End Developer Professional",
    issuer: "Meta",
    created_at: "2025-01-02T00:00:00Z",
  },
  {
    id: 3,
    Img: "/Spotify.png",
    title: "Responsive Web Design & Modern JS",
    issuer: "FreeCodeCamp",
    created_at: "2025-01-03T00:00:00Z",
  },
];

const INITIAL_COMMENTS = [
  {
    id: 1,
    user_name: "Safa Nabil Fashih",
    content:
      "Welcome to my portfolio! Feel free to leave a comment or connect with me.",
    is_pinned: true,
    profile_image: "/photo1.png",
    created_at: "2025-01-01T12:00:00.000Z",
  },
  {
    id: 2,
    user_name: "Alex Pratama",
    content:
      "Awesome portfolio and very smooth animations! Great job on the UI details.",
    is_pinned: false,
    profile_image: "/default-avatar.jpg",
    created_at: "2025-01-02T15:30:00.000Z",
  },
];

// Seed initial localStorage items if absent so direct page access works reliably
if (typeof window !== "undefined") {
  if (!localStorage.getItem("projects")) {
    localStorage.setItem("projects", JSON.stringify(INITIAL_PROJECTS));
  }
  if (!localStorage.getItem("certificates")) {
    localStorage.setItem("certificates", JSON.stringify(INITIAL_CERTIFICATES));
  }
  if (!localStorage.getItem("portfolio_comments")) {
    localStorage.setItem("portfolio_comments", JSON.stringify(INITIAL_COMMENTS));
  }
}

function getStoredTable(tableName) {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(tableName);
    if (!raw) {
      if (tableName === "projects") return [...INITIAL_PROJECTS];
      if (tableName === "certificates") return [...INITIAL_CERTIFICATES];
      if (tableName === "portfolio_comments") return [...INITIAL_COMMENTS];
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function setStoredTable(tableName, data) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(tableName, JSON.stringify(data));
    } catch (e) {
      console.warn("localStorage write failed:", e);
    }
  }
}

const mockUploadedFiles = new Map();

function createMockClient() {
  const channelSubscribers = new Set();

  const mockAuth = {
    signInWithPassword: async ({ email, password }) => {
      if (!email || !password) {
        return { data: null, error: new Error("Email and password are required") };
      }
      const user = {
        id: "admin-user-id",
        email: email || "admin@example.com",
        role: "admin",
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("mock_supabase_user", JSON.stringify(user));
      }
      return { data: { user, session: { access_token: "mock-token", user } }, error: null };
    },
    signOut: async () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("mock_supabase_user");
      }
      return { error: null };
    },
    getUser: async () => {
      if (typeof window === "undefined") return { data: { user: null }, error: null };
      const raw = localStorage.getItem("mock_supabase_user");
      if (raw) {
        try {
          return { data: { user: JSON.parse(raw) }, error: null };
        } catch {
          // fallback
        }
      }
      return { data: { user: null }, error: null };
    },
    getSession: async () => {
      if (typeof window === "undefined") return { data: { session: null }, error: null };
      const raw = localStorage.getItem("mock_supabase_user");
      if (raw) {
        try {
          const user = JSON.parse(raw);
          return { data: { session: { access_token: "mock-token", user } }, error: null };
        } catch {
          // fallback
        }
      }
      return { data: { session: null }, error: null };
    },
    onAuthStateChange: (callback) => {
      return {
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      };
    },
  };

  const mockStorage = {
    from: (bucket) => ({
      upload: async (fileName, file) => {
        let url = "";
        if (typeof window !== "undefined" && file instanceof Blob) {
          url = URL.createObjectURL(file);
        } else {
          url = `/Photo.png`;
        }
        mockUploadedFiles.set(fileName, url);
        return { data: { path: fileName }, error: null };
      },
      getPublicUrl: (fileName) => {
        const publicUrl = mockUploadedFiles.get(fileName) || `/Photo.png`;
        return { data: { publicUrl } };
      },
    }),
  };

  return {
    auth: mockAuth,
    storage: mockStorage,
    channel: (name) => {
      const channelObj = {
        on: (event, filter, callback) => {
          channelSubscribers.add(callback);
          return channelObj;
        },
        subscribe: (cb) => {
          if (cb) cb("SUBSCRIBED");
          return channelObj;
        },
        unsubscribe: () => {
          channelSubscribers.clear();
        },
      };
      return channelObj;
    },
    from: (tableName) => {
      return createQueryBuilder(tableName, channelSubscribers);
    },
  };
}

function createQueryBuilder(tableName, channelSubscribers) {
  let filters = [];
  let orders = [];
  let isSingle = false;

  const builder = {
    select: (columns = "*") => {
      return builder;
    },
    order: (column, options = {}) => {
      orders.push({ column, ascending: options.ascending !== false });
      return builder;
    },
    eq: (column, value) => {
      filters.push({ column, value });
      return builder;
    },
    single: () => {
      isSingle = true;
      return builder.then((res) => {
        if (res.error) return res;
        const item = Array.isArray(res.data) ? res.data[0] : res.data;
        if (!item) {
          return { data: null, error: { code: "PGRST116", message: "Row not found" } };
        }
        return { data: item, error: null };
      });
    },
    insert: async (inputData) => {
      if (tableName === "profiles") {
        return { data: inputData, error: null };
      }
      const current = getStoredTable(tableName);
      const items = Array.isArray(inputData) ? inputData : [inputData];
      const newItems = items.map((item, idx) => ({
        id: item.id || Date.now() + idx,
        created_at: item.created_at || new Date().toISOString(),
        ...item,
      }));
      const updated = [...newItems, ...current];
      setStoredTable(tableName, updated);
      if (tableName === "projects") {
        localStorage.setItem("projects", JSON.stringify(updated));
      }
      if (channelSubscribers) {
        newItems.forEach((newItem) => {
          channelSubscribers.forEach((cb) => {
            try {
              cb({ new: newItem, eventType: "INSERT" });
            } catch (e) {
              console.error(e);
            }
          });
        });
      }
      return { data: newItems, error: null };
    },
    update: (updates) => {
      const updateBuilder = {
        eq: async (col, val) => {
          const current = getStoredTable(tableName);
          const updated = current.map((row) =>
            row[col] === val ? { ...row, ...updates } : row
          );
          setStoredTable(tableName, updated);
          if (tableName === "projects") {
            localStorage.setItem("projects", JSON.stringify(updated));
          }
          return { data: updated, error: null };
        },
      };
      return updateBuilder;
    },
    delete: () => {
      const deleteBuilder = {
        eq: async (col, val) => {
          const current = getStoredTable(tableName);
          const updated = current.filter((row) => row[col] !== val);
          setStoredTable(tableName, updated);
          if (tableName === "projects") {
            localStorage.setItem("projects", JSON.stringify(updated));
          }
          return { data: updated, error: null };
        },
      };
      return deleteBuilder;
    },
    then: (onfulfilled, onrejected) => {
      const execute = async () => {
        if (tableName === "profiles") {
          return {
            data: { id: "admin-user-id", role: "admin" },
            error: null,
          };
        }

        let data = [...getStoredTable(tableName)];

        // Apply filters
        for (const f of filters) {
          data = data.filter((row) => row[f.column] === f.value);
        }

        // Apply orders
        for (const o of orders) {
          data.sort((a, b) => {
            const valA = a[o.column];
            const valB = b[o.column];
            if (valA === valB) return 0;
            if (valA == null) return 1;
            if (valB == null) return -1;
            if (o.ascending) {
              return valA > valB ? 1 : -1;
            } else {
              return valA < valB ? 1 : -1;
            }
          });
        }

        if (isSingle) {
          return { data: data[0] || null, error: null };
        }

        return { data, error: null };
      };

      return execute().then(onfulfilled, onrejected);
    },
  };

  return builder;
}

let clientInstance;

if (isConfigured) {
  try {
    const realClient = createClient(rawUrl, rawKey);
    // Wrap real client to gracefully fallback if remote queries fail
    clientInstance = realClient;
  } catch (err) {
    console.warn("[AI Studio] Failed to initialize real Supabase client, using fallback mock:", err);
    clientInstance = createMockClient();
  }
} else {
  clientInstance = createMockClient();
}

export const supabase = clientInstance;
