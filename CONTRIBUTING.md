# Contributing to this project

Please take a moment to review this document in order to make the contribution
process easy and effective for everyone involved.

_**Please Note:** These guidelines are adapted from [@necolas](https://github.com/necolas)'s
[issue-guidelines](https://github.com/necolas/issue-guidelines) and serve as
an excellent starting point for contributing to any open source project._

<a name="pull-requests"></a>
## Pull requests

Good pull requests - patches, improvements, new features - are a fantastic
help. They should remain focused in scope and avoid containing unrelated
commits.

**Please ask first** before embarking on any significant pull request (e.g.
implementing features, refactoring code, porting to a different language),
otherwise you risk spending a lot of time working on something that the
project's developers might not want to merge into the project.

<a name="development"></a>
## Development Process
Here are some guidelines to making changes and preparing your PR:

1. Make your proposed changes to the repository, along with updating/adding test cases.
2. (Optional) If you prefer to also test your changes in a real application, you can do the following:
  1. Run `yarn link` in `react-gpt` repository.
  2. Run `yarn build`
  3. `cd` to your favorite React application, run `yarn link @atmedia/react-gpt` to point to your local repository.
  4. Run your application to verify your changes. Note, if you are using Next.js or Webpack you might need to clear the webpack cache after making changes, e.g. by running `rm -rf .next/cache/webpack.
3. Run `yarn test` to verify all test cases pass.
4. Run `yarn run lint` to verify there are no linting errors.

<a name="travis-ci-build"></a>
## Travis CI Build

N/A

<a name="cla"></a>
## Contributor License Agreement (CLA)

N/A
