const WORK_ITEM_BASE = "https://dev.azure.com/denishaxhija5/Semantic-Release-Test/_workitems/edit/";

module.exports = {
  branches: ["main"],
  tagFormat: "v${version}",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "angular",
        releaseRules: [
          { type: "feat",     release: "minor"  },
          { type: "fix",      release: "patch"  },
          { type: "perf",     release: "patch"  },
          { type: "refactor", release: "patch"  },
          { type: "docs",     release: false    },
          { type: "chore",    release: false    },
          { type: "style",    release: false    },
          { type: "test",     release: false    }
        ],
        parserOpts: {
          noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES", "BREAKING"]
        }
      }
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "angular",
        parserOpts: {
          noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES", "BREAKING"],
          issuePrefixes: ["#"]
        },
        writerOpts: {
          commitsSort: ["subject", "scope"],
          finalizeContext: (ctx) => {
            ctx.commitGroups.forEach(group => {
              group.commits.forEach(commit => {
                (commit.references || []).forEach(ref => {
                  ref.url = WORK_ITEM_BASE + ref.issue;
                });
              });
            });
            return ctx;
          }
        }
      }
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md"
      }
    ],
    [
      "@semantic-release/exec",
      {
        prepareCmd: "echo ${nextRelease.version} > VERSION && mkdir -p dist && tar -czf dist/app-${nextRelease.version}.tar.gz src/ VERSION",
        publishCmd: "echo 'Artifact ready: dist/app-${nextRelease.version}.tar.gz'"
      }
    ],
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "VERSION"],
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ]
  ]
};
