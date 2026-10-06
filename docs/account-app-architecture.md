# MediRisk Account-Based Application Architecture

## Product Boundary

MediRisk will become an **installable web application**: users can install it from a supported browser on a phone or desktop and use it like an app, while accounts, health records, and uploads remain in the hosted application. The initial release is a research and personal-record organizer, not a clinical system or medical device. It must not make claims of HIPAA compliance, clinical certification, diagnostic capability, or emergency monitoring.

## Account and Ownership Model

Authentication will use the project’s built-in account service. Every health-related row and object reference will be owned by the authenticated user ID. Read, creation, and deletion operations will be protected server-side and scoped by this owner ID; the browser must never choose an owner ID.

| Resource | Owner | Access rule | Retention action |
| --- | --- | --- | --- |
| Profile | Authenticated account | Owner only | User can update display name |
| Assessment record | Authenticated account | Owner only | User can review/delete their records |
| Uploaded health material | Authenticated account | Owner only | User can download/delete their material |
| File object | Referenced by upload record | Signed/protected upload and owner-checked reference | Deleted when the user deletes the item where supported |

## Health Materials

The upload center will accept a deliberately narrow first-release set: PDF clinical reports and common image formats (`JPG`, `PNG`, `WEBP`) for user-provided records or images. It will display a category, optional title, date, short description, upload status, and safety reminder. Uploads will be capped by the platform-supported request constraints and rejected client- and server-side if their MIME type does not match the allowed categories. The user will be asked to upload only records they are authorized to store.

## Core Application Screens

| Screen | Purpose |
| --- | --- |
| Account gate | Starts sign-in for unauthenticated visitors; existing product data remains inaccessible until session validation completes. |
| Personal dashboard | Displays the current profile display name rather than a hard-coded name, plus private assessments and record counts. |
| Upload center | Creates a user-owned health-material record and uploads its protected file. |
| Health history library | Organizes the current user’s assessments and uploaded material by time and category; supports owner-only viewing, download, and deletion. |
| Profile & privacy | Lets the user set their display name and sign out; explains the prototype’s non-diagnostic scope. |

## PWA Delivery

The release will add a web manifest, app icons, standalone display mode, theme color, and mobile-first layout. It becomes installable from compatible browser menus. Native App Store/Google Play packages, app-store review, regulatory review, a business associate agreement, clinical integrations, and true offline handling of sensitive documents are outside this first release.

> **Privacy notice.** The application will provide authenticated ownership checks and protected storage paths, but production handling of health data requires an organization-specific security, privacy, legal, and compliance review before real-world clinical deployment.
