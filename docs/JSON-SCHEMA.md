# Path-Fast JSON Output Schema (v1)

All machine-readable CLI output uses `schemaVersion: 1`.

## Success envelope

```json
{
  "schemaVersion": 1,
  "ok": true,
  "data": {}
}
```

## Error envelope

```json
{
  "schemaVersion": 1,
  "ok": false,
  "error": {
    "message": "Human-readable message",
    "field": "optional.field.path"
  }
}
```

## Commands

| Command | `data` shape |
|---------|----------------|
| `pf list --json` | `{ "paths": PathEntry[] }` |
| `pf add --json` | `{ "entry": PathEntry }` |
| `pf go --dry-run --json` | `{ "plan": GoPlan }` |
| `pf export --json` | `{ "bundle": PathFastConfigBundle }` |
| `pf import --json` | `{ "imported": true, "pathsCount": number }` |
| `pf doctor --json` | `{ "checks": DoctorCheck[], "summary": DoctorSummary }` |

## Config bundle (`pf export` / `pf import`)

```json
{
  "schemaVersion": 1,
  "paths": [
    {
      "path": "/abs/path",
      "command": "api",
      "additional": ["make up"],
      "ideCommand": "cursor ."
    }
  ],
  "ide": {
    "command": "code ."
  }
}
```
