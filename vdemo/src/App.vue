<template>
  <!-- 这是 Vue 应用的根节点组件，往下看可以了解更多关注 Vue 组件的信息。 -->
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <h1>To-Do List</h1>
    <!-- 接下来，将todo-added事件的事件监听器添加到<to-do-form></to-do-form>，它在事件触发时调用addToDo()方法。
    使用@简写，监听器看起来像这样: -->
    <to-do-form @todo-added="addToDo"></to-do-form>

    <h2 id="list-summary" ref="listSummary" tabindex="-1">{{ listSummary }}</h2>
    <!-- 我们还将stack-large类添加到文件中的<ul>标记中App.vue。这将有助于稍微改善我们的待办事项的间距。
    更新如下： -->
    <ul aria-labelledby="list-summary" class="stack-large">
      <!-- 添加 v-for 指令和 key 属性到 <li> 元素：
        这样改后，<cli>标签中的js脚本就可以访问item了，这意味着我们可以使用v-bind来传递item对象的字段给ToDoItem组件了。
        这非常有用，我们想让列表中的待办事项的label值展示到它的label中，而不是显示一个静态的"My Todo Item"。
        此外，我们想让它们的checked状态反应它们的done字段，而不是默认的done="false"。 -->
      <!-- 把 label="My ToDo Item" 改成 :label="item.label", :done="false" 改成 :done="item.done" ： -->
      <li v-for="item in ToDoItems" :key="item.id">
        <!-- 通过将:done="true"传递给App.vue中的ToDoItem调用来测试组件。
        注意，您需要使用v-bind语法，否则true将作为字符串传递。应该选中显示的复选框。 -->
        <!-- <to-do-item label="My ToDo Item" :done="true"></to-do-item> -->
        <!-- 现在，在 App.vue 组件中将 item.id 作为一个prop传递给 ToDoItem 组件。你的 App.vue template如下所示： -->
        <to-do-item
          :label="item.label"
          :done="item.done"
          :id="item.id"
          @checkbox-changed="updateDoneStatus(item.id)"
          @item-deleted="deleteToDo(item.id)"
          @item-edited="editToDo(item.id, $event)"
        >
        </to-do-item>
        <!-- 你渲染后的站点看起来是没有变化的，但是这次重构使得item.id像其他参数一样，作为prop从App.vue传递给ToDoItem。现在代码变得更有逻辑性和一致。 -->
      </li>
    </ul>
  </div>
</template>

<script>
// 注意: 如果想要使用 TypeScript 语法，你应该将  <script> 标签的  lang 属性设置为 <script lang="ts"> 来告诉编译器你要使用 TypeScript。
// import HelloWorld from "./components/HelloWorld.vue";
import ToDoItem from "./components/ToDoItem.vue";
import ToDoForm from "./components/ToDoForm.vue";

// 在进行数据传递之前，我们要了解下key属性，它和v-for使用，用来帮助Vue标识列表中的元素，这样Vue就不需要在列表变化时重新创建它们。
// 但是Vue需要一个唯一的标识，即key来识别哪些元素是被复用的。
// 为了让Vue能正确的比较key ，key属性需要是numeric或者string类型。
// 用name字段不是个好主意，因为这个字段会被用户输入控制，无法保证唯一性。
// 我们可以使用lodash.uniqueid() ，像我们前一章节那样。
// 导入 lodash.uniqueid 到 App 组件。
import uniqueId from "lodash.uniqueid";

export default {
  // 对于 App.vue，我们的默认导出将组件的名称设置为 app ，并通过将 HelloWorld 组件添加到 components 属性中来注册它。
  // 以这种方式注册组件时，就是在本地注册。
  // 本地注册的组件只能在注册它们的组件内部使用，因此您需要将其导入并注册到使用它们的每个组件文件中。
  // 这对于拆包 / tree shaking（译者注：一种减小包体积优化方式）很有用，因为并不是应用程序中的每个页面都不一定需要每个组件。

  // 以App.vue为例，我们的默认导出将组件的名称设置为App，并通过将其添加到components属性中注册HelloWorld组件。
  // 当你以这种方式注册一个组件时，你是在本地注册它。
  // 本地注册的组件只能在注册它们的组件中使用，因此需要在使用它们的每个组件文件中导入并注册它们。
  // 这对于bundle split /tree shaking非常有用，因为应用中的每个页面不一定都需要每个组件。
  name: "App",
  components: {
    // 你可以在这里本地注册组件
    // HelloWorld,
    ToDoItem,
    ToDoForm,
  },

  // 现在我们已经有了一个可以工作的组件。我们接下来添加更多的 ToDoItem 组件到 我们的App。
  // 本文我们会添加一系列待办事项到App.vue组件并使用v-for指令遍历这些它们，将它们的每一项展示在ToDoItem组件中。

  // 利用 v-for 指令渲染列表
  // 一个有效的待办事项列表需要有多个被渲染的to-do项，Vue中的v-for 可以用来实现这种效果。
  // 它是Vue自带的指令，用于在template中实现循环，我们可以利用它将数组中的各项重复渲染成指定的特征。
  // 我们将利用它迭代待办事项列表，将其中的每一项展示为单独的ToDoItem组件。
  // 添加一些需要被渲染的数据
  // 首先我们需要准备一个待办事项数组。添加 data 属性到 App.vue 组件对象中， 它包含一个 ToDoItems 字段，其值是待办事项数组。
  // 在最终完成添加新的待办事项功能之前，我们可以先mock一些待办项目，每个待办项目可以用一个对象表示，这个对象含有 name 和 done 属性。
  // 像下面这样添加一些待办项目让我们可以利用v-for 来对它们进行渲染。
  data() {
    return {
      // 添加 id 字段到 ToDoItems 数组的每一个元素中, 并且将他们赋值为 uniqueId('todo-')。
      // App.vue <script> 元素内容如下：
      ToDoItems: [
        { id: uniqueId("todo-"), label: "Learn Vue", done: false },
        {
          id: uniqueId("todo-"),
          label: "Create a Vue project with the CLI",
          done: true,
        },
        { id: uniqueId("todo-"), label: "Have fun", done: true },
        { id: uniqueId("todo-"), label: "Create a to-do list", done: false },
      ],
    };
  },
  // 现在我们有了一个列表，可以用v-for去展示它们了。
  // 指令的作用方式和元素的属性类似，就v-for而言，
  // 它类似js中的for...in循环，v-for="item in items" — iterms是你要迭代的列表，
  // item 是数组中当前元素的引用。
  // v-for获取每个迭代的元素，并渲染它和它的子元素。
  // 在我们的例子中，我们用<li>的形式展示每一个待办事项，接下来我们会通过每个待办事项传递数据到其对应的ToDoItem组件。

  // 我们现在有了样例数据，然后我们用循环将每一项渲染成ToDoItem。
  // 接下来我们需要让用户可以输入它们自己的待办事项，想做到这一点，我们需要一个文本输入<input>，
  // 当用户输入数据时触发一个事件，在事件响应函数中需要将数据添加到待办事项列表并且重新渲染列表，我们还需要一个模型操控数据。
  // 我们将在下一篇文章中获取这些知识。

  // 接下来，回到App.vue，并向包含addToDo()方法的组件对象添加一个methods属性，如下所示。现在，这个方法只能记录添加到控制台的to -do。
  methods: {
    addToDo(toDoLabel) {
      // 为了在App.vue中实际获取这些数据，我们需要向addToDo()方法添加一个参数，该参数包含新的待办事项的标签。
      // 回到App.vue并立即更新:
      // 如果再次测试表单，您将看到提交时输入的文本已登录到控制台中。Vue自动将这个 this.$emit() 中的事件名称后面的参数传递给事件处理程序。
      // console.log('To-do added', toDoLabel);

      // 现在我们已经在App.vue中获得了来自ToDoForm的数据，我们需要向ToDoItems数组中添加一个表示它的项。
      // 这可以通过将一个新的待办事项对象推入包含新数据的数组来实现。
      // 更新addToDo()方法如下:
      this.ToDoItems.push({
        id: uniqueId("todo-"),
        label: toDoLabel,
        done: false,
      });
      // 再次尝试测试您的表单，您应该会看到新的待办事项附加到列表的末尾。
    },
    updateDoneStatus(toDoId) {
      const toDoToUpdate = this.ToDoItems.find((item) => item.id === toDoId);
      toDoToUpdate.done = !toDoToUpdate.done;
    },
    deleteToDo(toDoId) {
      const itemIndex = this.ToDoItems.findIndex((item) => item.id === toDoId);
      this.ToDoItems.splice(itemIndex, 1);
      this.$refs.listSummary.focus();
    },
    editToDo(toDoId, newLabel) {
      const toDoToEdit = this.ToDoItems.find((item) => item.id === toDoId);
      toDoToEdit.label = newLabel;
    },
  },
  computed: {
    listSummary() {
      const numberFinishedItems = this.ToDoItems.filter(
        (item) => item.done
      ).length;
      return `${numberFinishedItems} out of ${this.ToDoItems.length} items completed`;
    },
  },
};
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
/* 向单个文件组件添加全局样式
现在，我们已将CSS重置为在浏览器之间统一，我们需要对样式进行更多自定义。
我们希望将某些样式应用于应用程序中的各个组件。
虽然可以直接将这些文件添加到reset.css样式表中，但是我们将它们添加到的<style>标签中，App.vue以演示如何使用它们。
文件中已经存在一些样式。让我们删除它们，并用下面的样式替换它们。
这些样式可以做一些事情-为按钮和输入添加一些样式，并自定义#app元素及其子元素。
更新App.vue文件的<style>元素，如下所示： */

/* Global styles */
.btn {
  padding: 0.8rem 1rem 0.7rem;
  border: 0.2rem solid #4d4d4d;
  cursor: pointer;
  text-transform: capitalize;
}
.btn__danger {
  color: #fff;
  background-color: #ca3c3c;
  border-color: #bd2130;
}
.btn__filter {
  border-color: lightgrey;
}
.btn__danger:focus {
  outline-color: #c82333;
}
.btn__primary {
  color: #fff;
  background-color: #000;
}
.btn-group {
  display: flex;
  justify-content: space-between;
}
.btn-group > * {
  flex: 1 1 auto;
}
.btn-group > * + * {
  margin-left: 0.8rem;
}
.label-wrapper {
  margin: 0;
  flex: 0 0 100%;
  text-align: center;
}
[class*="__lg"] {
  display: inline-block;
  width: 100%;
  font-size: 1.9rem;
}
[class*="__lg"]:not(:last-child) {
  margin-bottom: 1rem;
}
@media screen and (min-width: 620px) {
  [class*="__lg"] {
    font-size: 2.4rem;
  }
}
.visually-hidden {
  position: absolute;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px 1px 1px 1px);
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
}
[class*="stack"] > * {
  margin-top: 0;
  margin-bottom: 0;
}
.stack-small > * + * {
  margin-top: 1.25rem;
}
.stack-large > * + * {
  margin-top: 2.5rem;
}
@media screen and (min-width: 550px) {
  .stack-small > * + * {
    margin-top: 1.4rem;
  }
  .stack-large > * + * {
    margin-top: 2.8rem;
  }
}
/* End global styles */
#app {
  background: #fff;
  margin: 2rem 0 4rem 0;
  padding: 1rem;
  padding-top: 0;
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 2.5rem 5rem 0 rgba(0, 0, 0, 0.1);
}
@media screen and (min-width: 550px) {
  #app {
    padding: 4rem;
  }
}
#app > * {
  max-width: 50rem;
  margin-left: auto;
  margin-right: auto;
}
#app > form {
  max-width: 100%;
}
#app h1 {
  display: block;
  min-width: 100%;
  width: 100%;
  text-align: center;
  margin: 0;
  margin-bottom: 1rem;
}
</style>
