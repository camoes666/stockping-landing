# Admin CMS Extension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the current draft-only editor into a Supabase-backed admin CMS that supports category CRUD, media insertion, and post draft persistence.

**Architecture:** Keep Astro as the site shell, but move admin authoring state into React islands backed by Supabase tables and API routes. Represent post bodies as structured content blocks so text, image, and video can coexist without fragile manual MDX composition during editing.

**Tech Stack:** Astro, TypeScript, React, Supabase, Vitest, Playwright

---

## Scope

This plan covers the next admin phase only. It extends the already-built public SEO blog.

Included:

- Category create, rename, delete
- Post draft create and update
- Structured post body blocks
- Image block insertion
- Video block insertion by URL
- Media asset metadata management
- Admin editor UI refresh

Excluded for this phase:

- Full publish workflow to public blog routes
- Rich text collaborative editing
- Role-based admin permissions
- Drag-and-drop uploads to third-party storage
- Revision history diff viewer

## Functional Requirements

### 1. Category management

- Admin can create a category with:
  - internal slug
  - display name
  - description
  - CTA default target
- Admin can rename display name and description
- Admin can change slug only if no slug collision exists
- Admin can delete a category only when no posts are attached, or after reassignment

### 2. Post draft management

- Admin can create a draft post
- Draft stores:
  - title
  - slug
  - description
  - category id
  - tags
  - summary lines
  - CTA type
  - featured flag
  - disclaimer flag
  - thumbnail
  - body blocks
- Draft can be saved without publishing
- Draft can be reopened in the editor later

### 3. Media insertion

- Admin can insert image blocks into the post body
- Admin can insert video blocks into the post body
- Video phase 1 can rely on embeddable URLs such as YouTube
- Media blocks must support:
  - caption
  - alt text for images
  - source URL
  - display order inside the post

### 4. Structured body blocks

Phase 1 block types:

- `paragraph`
- `heading`
- `image`
- `video`
- `quote`
- `list`

Each block must have a stable `id` and `type`.

## Data Model Changes

### New tables

#### `categories`

- `id`
- `slug`
- `name`
- `description`
- `default_cta_type`
- `sort_order`
- `is_active`
- `created_at`
- `updated_at`

#### `posts`

- `id`
- `title`
- `slug`
- `description`
- `category_id`
- `tags`
- `summary_lines`
- `thumbnail_url`
- `cta_type`
- `is_featured`
- `has_disclaimer`
- `status`
- `published_at`
- `updated_at`
- `created_at`

#### `post_blocks`

- `id`
- `post_id`
- `block_order`
- `block_type`
- `payload`
- `created_at`
- `updated_at`

#### `post_media_links`

- `id`
- `post_id`
- `media_asset_id`
- `block_id`
- `created_at`

### Existing table reuse

#### `media_assets`

Keep the table, but make it part of the admin flow instead of leaving it as future-only metadata.

Add or standardize:

- `mime_type`
- `embed_url`
- `provider`
- `status`

## File Structure

- `src/lib/admin-types.ts`
  Purpose: shared admin domain types for categories, drafts, and blocks.
- `src/lib/block-schema.ts`
  Purpose: block payload validation helpers.
- `src/lib/admin-api.ts`
  Purpose: browser-side fetch helpers for admin actions.
- `src/components/admin/PostEditor.tsx`
  Purpose: main editor shell, updated to persist drafts and manage blocks.
- `src/components/admin/CategoryManager.tsx`
  Purpose: category CRUD panel.
- `src/components/admin/BlockComposer.tsx`
  Purpose: add, reorder, update, and remove content blocks.
- `src/components/admin/MediaPicker.tsx`
  Purpose: select image/video assets or add embed URLs.
- `src/components/admin/DraftList.tsx`
  Purpose: existing draft browser for reopening saved work.
- `src/pages/admin/editor.astro`
  Purpose: admin editor route with hydrated workspace.
- `src/pages/api/admin/categories.ts`
  Purpose: list and create categories.
- `src/pages/api/admin/categories/[id].ts`
  Purpose: update and delete categories.
- `src/pages/api/admin/posts.ts`
  Purpose: list and create drafts.
- `src/pages/api/admin/posts/[id].ts`
  Purpose: update draft metadata and body.
- `src/pages/api/admin/media.ts`
  Purpose: create and list media asset records.
- `supabase/migrations/20260501_admin_cms_extension.sql`
  Purpose: add CMS tables and constraints.
- `tests/unit/editor.test.ts`
  Purpose: editor helper tests.
- `tests/unit/block-schema.test.ts`
  Purpose: block validation tests.
- `tests/unit/category-manager.test.ts`
  Purpose: category CRUD helper tests.

## Task Breakdown

### Task 1: Data model and migration update

**Files:**
- Create: `supabase/migrations/20260501_admin_cms_extension.sql`
- Create: `src/lib/admin-types.ts`
- Create: `src/lib/block-schema.ts`
- Test: `tests/unit/block-schema.test.ts`

Deliverables:

- CMS tables added
- block payload schema defined
- draft status enum defined

### Task 2: Admin API routes

**Files:**
- Create: `src/pages/api/admin/categories.ts`
- Create: `src/pages/api/admin/categories/[id].ts`
- Create: `src/pages/api/admin/posts.ts`
- Create: `src/pages/api/admin/posts/[id].ts`
- Create: `src/pages/api/admin/media.ts`
- Create: `src/lib/admin-api.ts`
- Test: `tests/unit/category-manager.test.ts`

Deliverables:

- category CRUD endpoints
- draft create/update endpoints
- media metadata endpoints

### Task 3: Category manager UI

**Files:**
- Create: `src/components/admin/CategoryManager.tsx`
- Modify: `src/components/admin/PostEditor.tsx`
- Test: `tests/unit/category-manager.test.ts`

Deliverables:

- add category
- rename category
- delete category with safe guard

### Task 4: Structured block composer

**Files:**
- Create: `src/components/admin/BlockComposer.tsx`
- Modify: `src/components/admin/PostEditor.tsx`
- Test: `tests/unit/editor.test.ts`

Deliverables:

- block list rendering
- add paragraph/heading/quote/list/image/video blocks
- remove and reorder blocks

### Task 5: Media support

**Files:**
- Create: `src/components/admin/MediaPicker.tsx`
- Modify: `src/components/admin/PostEditor.tsx`
- Modify: `src/pages/api/admin/media.ts`
- Test: `tests/unit/editor.test.ts`

Deliverables:

- image metadata entry
- image block insertion
- video URL block insertion
- caption and alt support

### Task 6: Draft persistence and recovery

**Files:**
- Create: `src/components/admin/DraftList.tsx`
- Modify: `src/pages/admin/editor.astro`
- Modify: `src/components/admin/PostEditor.tsx`
- Test: `tests/unit/editor.test.ts`

Deliverables:

- save draft
- load draft
- update draft

### Task 7: Admin UX refinement and validation

**Files:**
- Modify: `src/pages/admin/editor.astro`
- Modify: `src/styles/global.css`
- Modify: `src/components/admin/*.tsx`
- Test: `tests/e2e/admin-editor.spec.ts`

Deliverables:

- desktop two-column editor layout
- clear validation states
- visible success and error feedback

## Open Decisions Resolved

These decisions are now fixed for implementation:

- Source of truth for categories: `Supabase`
- Source of truth for drafts: `Supabase`
- Editor body model: `structured blocks`, not raw MDX textarea only
- Video phase 1: `URL/embed based`, not uploaded binary video storage
- Public blog routes remain Astro-rendered during this phase

## Notes For The Next Implementation Pass

- Do not keep category metadata hard-coded in `src/lib/blog.ts` as the long-term source of truth.
- Do not delete the existing MDX helper immediately; keep it as a migration fallback until draft-to-public publishing is defined.
- The current `/admin/editor` route is only a draft builder and should be treated as transitional UI.
