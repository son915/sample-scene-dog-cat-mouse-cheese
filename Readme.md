# 디센트럴랜드 미니 프로젝트(Dog Cat Mouse Cheese)
This example, that's described in greater detail in a [video tutorial](https://steemit.com/tutorial/@hardlydifficult/decentraland-tutorial-dog-cat-mouse-cheese-using-a-fsm) shows how to build a more complex scene that involves predators and prays, which can interchangably be mice, cats or dogs. Each animal has a stack-based finite state machine (FSM) to manage its AI. Each animal uses the a\* path finding algorythm to find its way around obstacles and othe animals.

[Explore the scene](https://dcl-project-bfvkjmdtyf.now.sh/?position=42%2C43): this link takes you to a copy of the scene deployed to a remote server where you can interact with it. You can also achieve the same by following the steps below and running it locally.

해당 튜토리얼에 대한 정보는 [링크](https://steemit.com/tutorial/@hardlydifficult/decentraland-tutorial-dog-cat-mouse-cheese-using-a-fsm)로 가면 자세히 확인할 수 있습니다. 이 튜토리얼은 디센트럴랜드에서 나무와 울타리 같은 복잡한 scene을 구현하고 고양이나 개가 쥐를 쫓는 상황을 가정한 가상의 튜토리얼입니다. 각 동물의 움직임은 FSM(Finate State Machine, 유한 상태 기계)를 사용하여 구현하였고, 장애물을 피하기 위한 알고리즘으론 [A* Search 알고리즘](https://en.wikipedia.org/wiki/A*_search_algorithm)을 사용하였습니다.

[Scene 탐색하기](https://dcl-project-bfvkjmdtyf.now.sh/?position=42%2C43): 해당 링크로 가시면 원격 서버에 구현된 Scene을 직접 탐색 해 볼 수 있습니다. 아래 시작하기를 따라하면 직접 로컬 서버에 Scene을 구현할 수 있습니다.

## 시작하기

**CLI 설치하기**

아래 명령어를 입력해 Decentraland CLI를 다운로드하고 설치합니다

```bash
npm i -g decentraland
```

Decentraland CLI 다운로드 및 설치에 대한 자세한 정보는 [설치 가이드 문서](https://docs.decentraland.org/documentation/installation-guide/)에서 확인할 수 있습니다.


**Scene 미리보기**

CLI를 설치후 본 저장소를 다운로드한 후 아래 명령어를 입력하면 구현된 Scene을 확인할 수 있습니다.


_코드를 복사한 위치에서 아래 명령어 입력:_

```
$:  dcl preview
```
위 명령어를 입력하면 Scene을 보기위한 의존모듈은 자동으로 다운 되고 브라우저에서 자동으로 Scene이 실행됩니다.
