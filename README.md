## Search inside JavaScript objects

If you work with client-side MVC libraries like Backbone you might
wonder where certain properties end up living on your JS objects.
Wouldn't it be nice to just grep the objects to find strings you know
are in there somewhere?

That's exactly what this bookmarklet lets you do.

    javascript:(function%20()%20%7Bvar%20script%20=%20document.createElement(%22script%22);script.src%20=%20%22https://raw.github.com/begriffs/objgrep/master/objgrep.js%22;document.getElementsByTagName(%22head%22)[0].appendChild(script);%7D());

It adds a `.grep` method to every object that you can use in the Chrome
console like this:

    var example = {x: {y: ['foo', 'bar', 'baz']}, s: "food is good"};
    example.grep(/foo/);  // returns [".x.y[0]", ".s"]

You can use it on the dom, or on any object really. It accepts a
`depth` option to limit search depth and avoid getting caught in cyclic
references.

    example.grep(/foo/, 3);   // searches with depth at most three
