# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0](https://git.0xmax42.io/maxp/http-kernel/compare/v0.1.0..v0.2.0) - 2025-05-27

### 🚀 Features

- *(workflows)* Add GitHub release sync workflow - ([de6d3ee](https://git.0xmax42.io/maxp/http-kernel/commit/de6d3ee389b0d92c5056e47be85da1d0c41f62af))
- *(ci)* Enhance CI workflow with granular steps and error handling - ([54cfa18](https://git.0xmax42.io/maxp/http-kernel/commit/54cfa1888e13d0872b5411e83d3d45925f2687ee))
- *(route-builder)* Add middleware chain compilation - ([35d83c0](https://git.0xmax42.io/maxp/http-kernel/commit/35d83c073ef8644d657195c332b463d18e856e18))
- *(interfaces)* Add runRoute method to IInternalRoute - ([67ebb43](https://git.0xmax42.io/maxp/http-kernel/commit/67ebb4307a2a1c588b78f8f0c498d1a4276ad09b))
- *(workflows)* Conditionally generate changelog - ([b44bb2d](https://git.0xmax42.io/maxp/http-kernel/commit/b44bb2ddafe99c85b25229d2c4a0dfeacf750052))
- *(workflows)* Add CI for Deno project tests - ([9d5db4f](https://git.0xmax42.io/maxp/http-kernel/commit/9d5db4f414cf961248f2b879f2b132b81a32cb92))

### 🐛 Bug Fixes

- *(workflows)* Ensure version detection output is always set - ([3707242](https://git.0xmax42.io/maxp/http-kernel/commit/3707242d278e15c55a41056bb64810f6824d24b3))

### 🚜 Refactor

- *(kernel)* Simplify middleware and handler execution - ([aea3fb4](https://git.0xmax42.io/maxp/http-kernel/commit/aea3fb45e7c099a38440c85783747e80fca54ba6))
- *(imports)* Use explicit type-only imports across codebase - ([b83aa33](https://git.0xmax42.io/maxp/http-kernel/commit/b83aa330b34523e5102ab98ee61dedbbd62d4656))
- *(workflows)* Rename changelog file for consistency - ([b9d25f2](https://git.0xmax42.io/maxp/http-kernel/commit/b9d25f23fc6ad7696deee319024aa5b1af4d98c0))

### 📚 Documentation

- *(release)* Update guidelines for handling changelog - ([6a0f1c7](https://git.0xmax42.io/maxp/http-kernel/commit/6a0f1c774bc01ab976090612bbc361576feb3942))
- Add README for HttpKernel project - ([a1ce306](https://git.0xmax42.io/maxp/http-kernel/commit/a1ce30627c68a3f869eb6a104308322af8596dc1))
- Add MIT license file - ([5118a19](https://git.0xmax42.io/maxp/http-kernel/commit/5118a19aeaa1102591aa7fe093fdec1aa19dc7f5))

### 🧪 Testing

- *(routebuilder)* Add validation tests for handler and middleware - ([b14e9ac](https://git.0xmax42.io/maxp/http-kernel/commit/b14e9acc5f9617a01886e7734b2ae717b86de03e))
- *(httpkernel)* Enforce compile-time validation for signatures - ([731bba2](https://git.0xmax42.io/maxp/http-kernel/commit/731bba22d88df077b0a39293ddd1a3eec3bf96e8))
- *(bench)* Add parallel benchmarks for HTTP kernel - ([3da34e2](https://git.0xmax42.io/maxp/http-kernel/commit/3da34e268426b92510c7f9b730a2fa297dca6fbf))

### ⚙️ Miscellaneous Tasks

- *(config)* Add CI task for local checks - ([c207dc7](https://git.0xmax42.io/maxp/http-kernel/commit/c207dc7392d9f40e7b7c736eadf6c9c7bbf9b7d4))
- *(gitignore)* Add .local directory to ignored files - ([1b447f5](https://git.0xmax42.io/maxp/http-kernel/commit/1b447f51900b3a1a7f1be9d5192fd5aba37bdbc4))
- *(ci)* Update deno tasks in CI workflow - ([38c00b0](https://git.0xmax42.io/maxp/http-kernel/commit/38c00b035bfd05c83d5898c97c9423a653db0840))
- *(tasks)* Add benchmark, format, and lint commands - ([6e6e616](https://git.0xmax42.io/maxp/http-kernel/commit/6e6e61693fef3b11a81ce260d80bc93edae1e718))
- *(workflows)* Consolidate and update CI configuration - ([ec1697d](https://git.0xmax42.io/maxp/http-kernel/commit/ec1697df94b5378f1766663e278a41d403a64336))
- *(config)* Add exports field to module metadata - ([c28eb7f](https://git.0xmax42.io/maxp/http-kernel/commit/c28eb7f28dfaa8d3fdc540c4bcc306a3a8b9d6f8))
- *(git)* Ignore merge conflicts for CHANGELOG.md - ([6399113](https://git.0xmax42.io/maxp/http-kernel/commit/6399113e122e1207ebf4113aebd250358e31f461))
- *(workflows)* Refine branch handling in release process - ([71ea424](https://git.0xmax42.io/maxp/http-kernel/commit/71ea4247b35dc4afe5090d3c6502bfa936b5a947))
- *(workflows)* Update changelog file extension to .md and revert b9d25f23fc - ([a88b4d1](https://git.0xmax42.io/maxp/http-kernel/commit/a88b4d112f5c07664d41f6e9d03246307551f25d))
- Rename changelog and readme files to use .md extension - ([4f2b650](https://git.0xmax42.io/maxp/http-kernel/commit/4f2b65049f461ef377e7231905fd066cbc3c7fe0))
- *(workflows)* Update test workflow for http-kernel project - ([0311546](https://git.0xmax42.io/maxp/http-kernel/commit/03115464e0fb01b8ca00a2fdabde013d004ae8a2))
- *(workflows)* Update Deno setup action to v2 - ([1233a0b](https://git.0xmax42.io/maxp/http-kernel/commit/1233a0b7204d12a60f4b7bd1199242a4cb7c4579))
- *(workflows)* Remove unused workflow_dispatch trigger - ([16c0053](https://git.0xmax42.io/maxp/http-kernel/commit/16c0053964c72d01e5f555ec8f33c9eead160e69))
- *(tasks)* Remove commented-out start and watch scripts - ([04029f8](https://git.0xmax42.io/maxp/http-kernel/commit/04029f87a3b9dd24e8792b852ead9097e18d23c7))

## [0.1.0] - 2025-05-08

### 🚀 Features

- *(workflows)* Add automated changelog and release workflow - ([bbf78cf](https://git.0xmax42.io/maxp/http-kernel/commit/bbf78cff17be0cae651b8abf3e239103b26354bf))
- *(vscode)* Customize activity bar and peacock colors - ([56633cd](https://git.0xmax42.io/maxp/http-kernel/commit/56633cd95b37a8b2cfd8eb95982d07cd1f9b5126))
- *(workflows)* Add upload assets template for releases - ([7b6eb2b](https://git.0xmax42.io/maxp/http-kernel/commit/7b6eb2b57470198684a1dfa8b668351b8b9a91ae))
- *(config)* Add project metadata and test watch task - ([b009b57](https://git.0xmax42.io/maxp/http-kernel/commit/b009b5763d1824fc94fdc1e3d919fe2597158f84))
- *(http)* Add error handling for invalid HTTP methods - ([ba7aa79](https://git.0xmax42.io/maxp/http-kernel/commit/ba7aa79f56772213bf73b62bc6bf8810f3871127))
- *(http)* Enhance type safety and extend route context - ([a236fa7](https://git.0xmax42.io/maxp/http-kernel/commit/a236fa7c97ae49e6baf560d4ca92c6e83702b3ec))

### 🐛 Bug Fixes

- *(params)* Enforce non-undefined route parameter values - ([b0c6901](https://git.0xmax42.io/maxp/http-kernel/commit/b0c6901d7d272ec98b3d00ef2dd2848482892a25))

### 🚜 Refactor

- *(types)* Unify handler and middleware definitions - ([8235680](https://git.0xmax42.io/maxp/http-kernel/commit/8235680904c7f30f25b98b835d48376431108e91))
- *(core)* [**breaking**] Enhance HttpKernel pipeline and matcher system with full context and error handling - ([b7410b4](https://git.0xmax42.io/maxp/http-kernel/commit/b7410b44dd8720e46ee2871aa1727ce5039ebad4))
- *(httpkernel)* Introduce configuration object for flexibility - ([9059bdd](https://git.0xmax42.io/maxp/http-kernel/commit/9059bdda62081c8e775087cabe4c3406e42065a5))

### 📚 Documentation

- *(gitea)* Add release automation guide and scripts - ([5c03cdf](https://git.0xmax42.io/maxp/http-kernel/commit/5c03cdfb031adeb6ee5d0de0889477d6d1efafef))
- *(httpkernel)* Enhance class and interface documentation - ([6c4420d](https://git.0xmax42.io/maxp/http-kernel/commit/6c4420d32f8e7fe317f7c1b0b45de2dcf8565ef5))

### 🧪 Testing

- *(utils)* Rename and update import paths in test file - ([82a6877](https://git.0xmax42.io/maxp/http-kernel/commit/82a687748558f15c2023861a0cc3a33095c86731))
- *(utils)* Add unit tests for parseQuery function - ([94525fc](https://git.0xmax42.io/maxp/http-kernel/commit/94525fce5299f3417801f0152a475892e1edac30))

### ⚙️ Miscellaneous Tasks

- *(config)* Add default git-cliff configuration - ([661f83d](https://git.0xmax42.io/maxp/http-kernel/commit/661f83d1fd0101aa0d5d06b60f6eeb68efac6ceb))
- *(gitignore)* Add .gitea/COMMIT_GPT.md to ignored files - ([f083856](https://git.0xmax42.io/maxp/http-kernel/commit/f0838567b46822327fe739d8de099722e405dfa3))
- *(settings)* Add exportall configuration for barrel name and message - ([0990cac](https://git.0xmax42.io/maxp/http-kernel/commit/0990cacb225e1cbbbbb2a288501df7de9641294f))
- *(.gitignore)* Add git_log_diff.txt to ignore list - ([fd1c7f4](https://git.0xmax42.io/maxp/http-kernel/commit/fd1c7f4170ffffd55ab276090f8b90ee82b853fc))


