# How to contribute

-   [Submitting bug reports](#submitting-bug-reports)
-   [Contributing code](#contributing-code)

## Submitting bug reports

The preferred way to report bugs is to use the
[GitHub issue tracker](http://github.com/NotTimTam/jtf/issues). Before
reporting a bug, read these pointers.

### Reporting bugs effectively

-   `.jtf` is an unfunded open-source project. Bug reporters should follow the Golden Rule within their reports.

-   Indicate which version of `jtf` you're using.

-   Describe your error plainly and in great detail. What did you expect to happen? What happened instead? Describe the exact steps needed to make the problem occur. An unobservable error is an unfixable error.

-   Please provide a minimally reproducable example that demonstrates the problem.

## Contributing code

-   Make sure you have a [GitHub Account](https://github.com/signup/free)
-   Fork [jtf](https://github.com/NotTimTam/jtf/)
    ([how to fork a repo](https://help.github.com/articles/fork-a-repo))
-   Make your changes
-   If your changes are easy to test or likely to regress, add tests.
    Tests go into `test/test.js`.
-   Follow the general code style of the rest of the project (see
    below).
-   Make sure all tests pass. Visit `test/index.html` in your browser to
    run them.
-   Submit a pull request
    ([how to create a pull request](https://help.github.com/articles/fork-a-repo)).
    Don't put more than one feature/fix in a single pull request.

By contributing code to `.jtf` you

-   agree to license the contributed code under `.jtf`'s [MIT
    license](LICENSE).

-   confirm that you have the right to contribute and license the code
    in question. (Either you hold all rights on the code, or the rights
    holder has explicitly granted the right to use it like this,
    through a compatible open source license or through a direct
    agreement with you.)

### Coding standards

-   `.jtf` does _not_ follow JSHint or JSLint prescribed style.
    Patches that try to 'fix' code to pass one of these linters will be ignored.
