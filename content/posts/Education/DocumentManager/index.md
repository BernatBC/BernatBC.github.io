---
title: "Document manager"
date: 2023-01-22T06:00:23+06:00
description: Document manager
theme: Toha
menu:
  sidebar:
    name: Document Manager
    identifier: documentmanager
    parent: education
    weight: 500
draft: false
tags: ["Education", "Java"]
math: true
thumbnail: hero.png
---

## The statement
The _Programming Projects_ college subject asked us to create an application to manage documents using Java. This application has to feature the creation of a document, importing and exporting files in three different formats: plaintext, XML and our own format. The application also has to have the ability to delete and modify these documents. The main feature of the application is the various document queries that allow us to find a certain document or author in the application.

The full statement is in the document below. Note that the statement is in Catalan.

<embed src="enunciatProp.pdf" width="100%" height="700" type="application/pdf">

## Our solution
[@alexland7219](https://github.com/alexland7219), [@Loparc](https://github.com/Loparc), Salvador and I started making a use case diagram to list all the features and functionalities we wanted to add in our application. Then we made the domain class diagram. This helped us to structure the domain layer. Alongside these diagrams, we made the description of each use case and class.

After these diagrams were verified by our tutor, we started the implementation of the domain layer. It was straightforward except for a couple of algorithms and a data structure. We used the [Ternary Search Tree](https://en.wikipedia.org/wiki/Ternary_search_tree) data structure to index all words contained in the documents. As we already used it in _Algorithms_ course, we didn't have much trouble with it. The algorithm we found the most challenging was the [term frequency–inverse document frequency](https://en.wikipedia.org/wiki/Tf%E2%80%93idf) also known as tf-idf. Tf-idf algorithm allows us to rank a word on how important it is to a certain document.

After the domain layer was reviewed by our tutor, he asked us to make some changes to not infringe the multilayer architecture and to make our application more efficient. After these changes were made, we designed the class diagram of the persistence layer and the presentation layer. We implemented both layers in parallel. The persistence layer was not difficult. We had trouble making our interface user-friendly. To be honest, our final version is not as user-friendly as we wanted.

## Gallery

{{< figure src="general.png">}}
<p style="text-align: center;">An overview of the home screen of the application.</p>

{{< line_break >}}

{{< figure src="import.png">}}
<p style="text-align: center;">Widow that allow us to import documents.</p>

{{< line_break >}}

{{< figure src="preferencia.png">}}
<p style="text-align: center;">An example of a query to find the most relevant documents given a word.</p>

{{< line_break >}}

{{< figure src="booleana.png">}}
<p style="text-align: center;">An example of a query using a boolean expression.</p>

{{< line_break >}}

### [View Code and report on <i class="fab fa-github"></i>Github](https://github.com/BernatBC/PROP) 
