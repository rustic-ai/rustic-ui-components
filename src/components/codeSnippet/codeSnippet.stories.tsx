import type { Meta } from '@storybook/react-webpack5'
import type React from 'react'
import type { ComponentType } from 'react'

import CodeSnippet from './codeSnippet'
const meta: Meta<React.ComponentProps<typeof CodeSnippet>> = {
  title: 'Rustic UI/Code Snippet/Code Snippet',
  component: CodeSnippet,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
const tsxCode = `import React from 'react';

interface GreetingProps {
  name: string;
}

const Greeting: React.FC<GreetingProps> = ({ name }) => {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Welcome to the TypeScript world.</p>
    </div>
  );
};

export default Greeting;
`

const jsCode = `function greet(name) {
  console.log('Hello, ' + name + '!');
}

greet('JavaScript');
`

const pyCode = `def greeting(name):
print("Hello, " + name)

person1 = {
"name": "John",
"age": 36,
"country": "Norway"
}`

const htmlCode = `<header class="site-header">
  <div class="container">
    <h1>Example #2</h1>
    <nav role="navigation" class="site-navigation">
      <ul>
        <li><a href="#">Link</a></li>
        <li><a href="#">Link</a></li>
        <li><a href="#">Link</a></li>
      </ul>
    </nav>
  </div>
</header>
<section role="main" class="container"><img src="http://placehold.it/1400x400/ff694d/f6f2eb" class="banner-image" />
  <div class="grid-row col-3">
    <div class="grid-unit"><img src="http://placehold.it/650x300/ff694d/f6f2eb" />
      <p>Nullam quis risus eget urna mollis ornare vel eu leo. Donec id elit non mi porta gravida at eget metus. Curabitur blandit tempus porttitor.</p>
    </div>
    <div class="grid-unit"><img src="http://placehold.it/650x300/ff694d/f6f2eb" />
      <p>Nullam quis risus eget urna mollis ornare vel eu leo. Donec id elit non mi porta gravida at eget metus. Curabitur blandit tempus porttitor.</p>
    </div>
    <div class="grid-unit"><img src="http://placehold.it/650x300/ff694d/f6f2eb" />
      <p>Nullam quis risus eget urna mollis ornare vel eu leo. Donec id elit non mi porta gravida at eget metus. Curabitur blandit tempus porttitor.</p>
    </div>
  </div>
</section>`

const phpCode = `<?php
$greeting = "Hello!";
$month = 8;
$year = 2019;
?>`

const cssCode = `p {
  color: blue; 
  font-size: 16px; 
  font-family: Arial, sans-serif; 
}`

const javaCode = `public class Main {
  public static void main(String[] args) {
  
    ArrayList<String> cars = new ArrayList<String>();
    cars.add("Volvo");
    cars.add("BMW");
    cars.add("Ford");
    cars.add("Mazda");
  
    Iterator<String> it = cars.iterator();
    
    while(it.hasNext()) {
      System.out.println(it.next());
    }
  }
}`

const cppCode = `#include <iostream>

int main() {
    // Prints "Hello, World!" to the console
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`

const goCode = `package main

import "fmt"

func main() {
    greet("Go")
}

func greet(name string) {
    fmt.Println("Hello, " + name + "!")
}`

export const TSX = {
  args: {
    code: tsxCode,
    language: 'TSX',
  },
}

export const JS = {
  args: {
    code: jsCode,
    language: 'JavaScript',
  },
}

export const Python = {
  args: {
    code: pyCode,
    language: 'Python',
  },
}

export const PHP = {
  args: {
    code: phpCode,
    language: 'PHP',
  },
}

export const Java = {
  args: {
    code: javaCode,
    language: 'Java',
  },
}
export const CSS = {
  args: {
    code: cssCode,
    language: 'CSS',
  },
}

export const CPP = {
  args: {
    code: cppCode,
    language: 'C++',
  },
}

export const Go = {
  args: {
    code: goCode,
    language: 'Go',
  },
}

export const HTMLInsideAParentContainer = {
  args: {
    code: htmlCode,
    language: 'HTML',
  },
  decorators: [
    (Story: ComponentType) => {
      return (
        <div style={{ maxWidth: '600px' }}>
          <Story />
        </div>
      )
    },
  ],
}

export const UnsupportedLanguage = {
  args: {
    code: javaCode,
    language: 'UnsupportedLanguage',
  },
}
