
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** GalataSchool
- **Date:** 2026-03-09
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 Create a new artifact with all required trilingual fields and publish status
- **Test Code:** [TC001_Create_a_new_artifact_with_all_required_trilingual_fields_and_publish_status.py](./TC001_Create_a_new_artifact_with_all_required_trilingual_fields_and_publish_status.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Image URL input field not found on the 'Yeni Eser' create artifact form; there is no visible text input to paste an external image URL.
- Only a file upload control (input type=file, index 1459) is present on the form, which prevents setting an external image URL as required by the test specification.
- Artifact creation cannot be completed according to the provided test steps because the required image-URL entry feature is missing.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/cbf56969-b621-468c-9ee6-be5cdfd5593f/f2ea4f36-d663-4040-89b3-45763b4e7a6f
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 Create artifact validation: missing image URL shows required-field error
- **Test Code:** [TC002_Create_artifact_validation_missing_image_URL_shows_required_field_error.py](./TC002_Create_artifact_validation_missing_image_URL_shows_required_field_error.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/cbf56969-b621-468c-9ee6-be5cdfd5593f/6bf11f58-f65f-4cee-91a4-f57336a8821c
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 Create artifact validation: missing Turkish title shows required-field error
- **Test Code:** [TC003_Create_artifact_validation_missing_Turkish_title_shows_required_field_error.py](./TC003_Create_artifact_validation_missing_Turkish_title_shows_required_field_error.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/cbf56969-b621-468c-9ee6-be5cdfd5593f/0fd5bc36-4982-4c14-9f80-27af5aa1466b
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 Edit an existing artifact and verify updated title appears in list
- **Test Code:** [TC005_Edit_an_existing_artifact_and_verify_updated_title_appears_in_list.py](./TC005_Edit_an_existing_artifact_and_verify_updated_title_appears_in_list.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/cbf56969-b621-468c-9ee6-be5cdfd5593f/2570ac40-46e6-4332-a0c5-7a1049cc4e9f
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006 Edit artifact validation: clearing required field shows error and prevents save
- **Test Code:** [TC006_Edit_artifact_validation_clearing_required_field_shows_error_and_prevents_save.py](./TC006_Edit_artifact_validation_clearing_required_field_shows_error_and_prevents_save.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/cbf56969-b621-468c-9ee6-be5cdfd5593f/7cd86af8-b2a8-46fb-82df-7553d855300f
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007 Create a new event with required fields (TR) and save successfully
- **Test Code:** [TC007_Create_a_new_event_with_required_fields_TR_and_save_successfully.py](./TC007_Create_a_new_event_with_required_fields_TR_and_save_successfully.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Admin dashboard did not load; the /admin page displays a login form and 'Giriş Yap' button.
- Event creation UI ('Yeni Etkinlik Ekle' or Events module in the admin area) is not accessible from the current page.
- Admin session injection appears not to be applied, preventing creation and verification of a past event.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/cbf56969-b621-468c-9ee6-be5cdfd5593f/92074866-ac3e-4939-96c0-20cf2e4e1573
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008 Verify events table loads and shows expected column headers
- **Test Code:** [TC008_Verify_events_table_loads_and_shows_expected_column_headers.py](./TC008_Verify_events_table_loads_and_shows_expected_column_headers.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/cbf56969-b621-468c-9ee6-be5cdfd5593f/22e291c5-1d94-478a-bab0-aa145dce4ace
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010 Date validation: leave event date empty and verify validation error shown
- **Test Code:** [TC010_Date_validation_leave_event_date_empty_and_verify_validation_error_shown.py](./TC010_Date_validation_leave_event_date_empty_and_verify_validation_error_shown.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/cbf56969-b621-468c-9ee6-be5cdfd5593f/676a6756-f014-47af-b9f5-23e676dfedc1
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011 Date validation: enter invalid date format and verify validation error shown
- **Test Code:** [TC011_Date_validation_enter_invalid_date_format_and_verify_validation_error_shown.py](./TC011_Date_validation_enter_invalid_date_format_and_verify_validation_error_shown.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/cbf56969-b621-468c-9ee6-be5cdfd5593f/6669dc93-0c13-496a-b5b2-331c5aab82ab
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013 Create a new venue with multilingual titles, level, and capacities
- **Test Code:** [TC013_Create_a_new_venue_with_multilingual_titles_level_and_capacities.py](./TC013_Create_a_new_venue_with_multilingual_titles_level_and_capacities.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/cbf56969-b621-468c-9ee6-be5cdfd5593f/89d68103-436e-4217-9186-e385039cc1fb
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014 Save newly created venue and verify it appears in the list
- **Test Code:** [TC014_Save_newly_created_venue_and_verify_it_appears_in_the_list.py](./TC014_Save_newly_created_venue_and_verify_it_appears_in_the_list.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Admin dashboard did not load after attempting login — login form remains visible.
- Clicking 'Giriş Yap' produced no navigation or admin UI; the 'Venue' tab is not accessible.
- Session injection described in Extra Info appears not applied; authentication is still required.
- Venue creation steps could not be executed because the admin dashboard was not reachable.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/cbf56969-b621-468c-9ee6-be5cdfd5593f/5989e3a3-6eae-4ef0-b66f-d053ac1ba957
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC016 Validation error when level is missing on create
- **Test Code:** [TC016_Validation_error_when_level_is_missing_on_create.py](./TC016_Validation_error_when_level_is_missing_on_create.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- ASSERTION: Admin login form is displayed at /admin instead of the admin dashboard; the admin session injection appears not to be active.
- ASSERTION: The 'Yeni Mekan Ekle' / Venue creation UI cannot be reached because the admin sidebar and venue actions are not available while the login form is shown.
- ASSERTION: The required-field validation for the create-venue form could not be tested because the create-venue form could not be opened.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/cbf56969-b621-468c-9ee6-be5cdfd5593f/e86bb383-6ed3-4e2c-a484-dc6ed89f0ee6
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC017 Edit an existing venue and add a feature (TR)
- **Test Code:** [TC017_Edit_an_existing_venue_and_add_a_feature_TR.py](./TC017_Edit_an_existing_venue_and_add_a_feature_TR.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/cbf56969-b621-468c-9ee6-be5cdfd5593f/33c68a12-ef9b-492d-93ce-24f83de761c5
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC021 Create a new history timeline entry and verify it appears in the table ordered by Sıra (order_index)
- **Test Code:** [TC021_Create_a_new_history_timeline_entry_and_verify_it_appears_in_the_table_ordered_by_Sra_order_index.py](./TC021_Create_a_new_history_timeline_entry_and_verify_it_appears_in_the_table_ordered_by_Sra_order_index.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Expected history title "Test Tarihçe Kaydı TR" not found in history table; visible title is "Test History Title TR".
- Expected order_index '10' for the created entry but the table shows '0' for the entry with year '1999'.
- No creation action was performed during this session, so cannot confirm the admin creation flow produced the requested entry with the specified fields.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/cbf56969-b621-468c-9ee6-be5cdfd5593f/5678f944-f34d-4e83-beb1-172ccd5f2fd9
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC023 Validation: prevent saving when Year is missing
- **Test Code:** [TC023_Validation_prevent_saving_when_Year_is_missing.py](./TC023_Validation_prevent_saving_when_Year_is_missing.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/cbf56969-b621-468c-9ee6-be5cdfd5593f/2a851ed5-7648-415f-94fb-8cea95f6c1fe
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **66.67** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---