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
          commitsSort: ["subject", "scope"]
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
        prepareCmd: "node -e \"const fs=require('fs');const BASE='https://dev.azure.com/denishaxhija5/Semantic-Release-Test/_workitems/edit/';let md=fs.readFileSync('CHANGELOG.md','utf8');const lines=md.split('\\n');const result=[];for(let i=0;i<lines.length;i++){const l=lines[i];const ref=l.match(/\\[#(\\d+)\\]\\([^)]+\\)/);if(l.startsWith('* ')&&ref){const id=ref[1];const clean=l.replace(/\\s*\\[#\\d+\\]\\([^)]+\\)/,' ').trim();result.push(clean);result.push('');result.push('* Work Item: [#'+id+']('+BASE+id+')');}else{result.push(l);}}fs.writeFileSync('CHANGELOG.md',result.join('\\n'));\" && echo ${nextRelease.version} > VERSION && mkdir -p dist && tar -czf dist/app-${nextRelease.version}.tar.gz src/ VERSION",
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
