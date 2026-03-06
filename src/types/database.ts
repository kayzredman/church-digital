// Database Types for Church Platform

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "editor" | "contributor" | "member" | "visitor";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sermon {
  id: string;
  title: string;
  description: string;
  speaker: string;
  category: string;
  videoUrl?: string;
  audioUrl?: string;
  thumbnailUrl?: string;
  date: string;
  duration?: number;
  views: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  imageUrl?: string;
  category: string;
  capacity?: number;
  registered: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  imageUrl?: string;
  category: string;
  tags: string[];
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Donation {
  id: string;
  userId?: string;
  amount: number;
  currency: string;
  paymentMethod: "stripe" | "paystack" | "offline";
  status: "pending" | "completed" | "failed";
  transactionId?: string;
  email?: string;
  name?: string;
  message?: string;
  createdAt: string;
}

export interface Ministry {
  id: string;
  name: string;
  description: string;
  leader: string;
  imageUrl?: string;
  contactEmail?: string;
  meetingDay?: string;
  meetingTime?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChurchSettings {
  id: string;
  churchName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  about: string;
  logo?: string;
  banner?: string;
  serviceTime: string;
  pastorName: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId?: string;
  email: string;
  name: string;
  phone?: string;
  guests: number;
  status: "registered" | "cancelled" | "attended";
  createdAt: string;
  updatedAt: string;
}
