# Decentraland Dog Cat Mouse Cheese

This example, that's described in greater detail in a [video tutorial](https://steemit.com/tutorial/@hardlydifficult/decentraland-tutorial-dog-cat-mouse-cheese-using-a-fsm) shows how to build a more complex scene that involves predators and prays, which can interchangably be mice, cats or dogs. Each animal has a stack-based finite state machine (FSM) to manage its AI. Each animal uses the a\* path finding algorythm to find its way around obstacles and othe animals.

[Explore the scene](https://dcl-project-bfvkjmdtyf.now.sh/?position=42%2C43): this link takes you to a copy of the scene deployed to a remote server where you can interact with it. You can also achieve the same by following the steps below and running it locally.

## Getting started

**Install the CLI**

Download and install the Decentraland CLI by running the following command

```bash
npm i -g decentraland
```

For a more details, follow the steps in the [Installation guide](https://docs.decentraland.org/documentation/installation-guide/).


**Previewing the scene**


Once you've installed the CLI, download this example and navigate to its directory from your terminal or command prompt.

_from the scene directory:_

```
$:  dcl preview
```

Any dependencies are installed and then the CLI will open the scene in a new browser tab automatically.
