# PostHog post-wizard report

The wizard has completed a deep integration of the path-fast CLI tool with PostHog analytics. A new `src/utils/posthog.ts` singleton was created that initializes the `posthog-node` SDK with `flushAt: 1` and `flushInterval: 0` (suitable for short-lived CLI processes) and generates a stable anonymous machine ID stored at `~/.path-fast/analytics-id.json`. Ten events are now captured across eight command files, covering all key user actions from path registration through navigation, editing, deletion, config management, and diagnostics.

| Event name | Description | File |
|---|---|---|
| `path_added` | User successfully adds a new project path shortcut. | `src/commands/add-path.ts` |
| `path_add_failed` | User encounters an error while adding a project path shortcut. | `src/commands/add-path.ts` |
| `path_navigated` | User successfully navigates to a registered project path. | `src/commands/go-path.ts` |
| `path_navigation_failed` | User attempts to navigate to a path that does not exist in the registry. | `src/commands/go-path.ts` |
| `path_deleted` | User successfully deletes a registered path shortcut. | `src/commands/delete.ts` |
| `path_edited` | User saves edits to a registered path shortcut. | `src/commands/edit-path.ts` |
| `config_exported` | User exports their path configuration to a file or stdout. | `src/commands/export-config.ts` |
| `config_imported` | User successfully imports a configuration bundle from a file. | `src/commands/import-config.ts` |
| `ide_configured` | User sets or updates their preferred global IDE command. | `src/commands/ide-set.ts` |
| `doctor_run` | User runs the doctor diagnostic command to check their configuration. | `src/commands/doctor.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/501948/dashboard/1811552)
- [Path navigations over time](https://us.posthog.com/project/501948/insights/XX2MXCpe)
- [Navigation success vs failure](https://us.posthog.com/project/501948/insights/jgeIciOY)
- [CLI actions breakdown](https://us.posthog.com/project/501948/insights/CidMlvoF)
- [Unique active users over time](https://us.posthog.com/project/501948/insights/0vxf7SFZ)
- [Config operations over time](https://us.posthog.com/project/501948/insights/dsnC2AYY)

## Verify before merging

- [ ] Run `pnpm install` to install the `posthog-node` dependency that was added to `package.json`.
- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` (and any CI/bootstrap scripts) so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
