import { z } from "zod";

// Subset of the JSON Resume schema (jsonresume.org), all fields optional so a
// sparse resume still validates. Dates are kept as the strings found in the
// resume (YYYY, YYYY-MM or YYYY-MM-DD); empty/unknown values are omitted.
const str = z.string();

const Location = z.object({
  address: str.optional(),
  postalCode: str.optional(),
  city: str.optional(),
  region: str.optional(),
  countryCode: str.optional(),
});

const Profile = z.object({
  network: str.optional(),
  username: str.optional(),
  url: str.optional(),
});

export const ResumeSchema = z.object({
  basics: z.object({
    name: str.optional(),
    label: str.optional(),
    email: str.optional(),
    phone: str.optional(),
    url: str.optional(),
    summary: str.optional(),
    location: Location.optional(),
    profiles: z.array(Profile).optional(),
  }),
  work: z
    .array(
      z.object({
        name: str.optional(),
        position: str.optional(),
        location: str.optional(),
        startDate: str.optional(),
        endDate: str.optional().describe("Omit if this is the current job"),
        summary: str.optional(),
        highlights: z.array(str).optional(),
      }),
    )
    .optional(),
  education: z
    .array(
      z.object({
        institution: str.optional(),
        area: str.optional(),
        studyType: str.optional(),
        startDate: str.optional(),
        endDate: str.optional(),
        score: str.optional(),
      }),
    )
    .optional(),
  skills: z
    .array(
      z.object({
        name: str.optional(),
        level: str.optional(),
        keywords: z.array(str).optional(),
      }),
    )
    .optional(),
  languages: z
    .array(z.object({ language: str.optional(), fluency: str.optional() }))
    .optional(),
  projects: z
    .array(
      z.object({
        name: str.optional(),
        description: str.optional(),
        url: str.optional(),
        highlights: z.array(str).optional(),
        keywords: z.array(str).optional(),
      }),
    )
    .optional(),
  certificates: z
    .array(
      z.object({
        name: str.optional(),
        issuer: str.optional(),
        date: str.optional(),
        url: str.optional(),
      }),
    )
    .optional(),
});

export type Resume = z.infer<typeof ResumeSchema>;
