<template>
  <!-- 我们需要使用.prevent处理程序来停止浏览器的默认提交操作。添加.prevent到@submit模板中的处理程序，如下所示： -->
  <form @submit.prevent="onSubmit">
    <!-- 当我们在这里时，我们还可以进行另一种语义和样式更改。
    由于我们的表单表示页面的特定部分，因此它可以从<h2>元素中受益。
    然而，标签已经表明了表单的用途。为了避免重复我们自己，让我们将我们的标签包裹在一个<h2>. 我们还可以添加其他一些全局 CSS 样式。
    我们还将将该input__lg类添加到我们的<input>元素中。
    更新您的ToDoForm模板，使其看起来像这样： -->
    <h2 class="label-wrapper">
      <label for="new-todo-input" class="label__lg">
        What needs to be done?
      </label>
    </h2>

    <!-- 接下来，我们需要一种从表单中获取值的方法，<input>以便我们可以将新的待办事项添加到我们的ToDoItems数据列表中。
    我们需要的第一件事是data我们表单中的一个属性来跟踪待办事项的价值。 -->

    <!-- 我们现在需要某种方式将new-todo-input <input>字段的值附加到label字段。Vue 对此有一个特殊的指令：v-model. 
    v-model绑定到您在其上设置的数据属性并使其与<input>. v-model适用于所有各种输入类型，包括复选框、收音机和选择输入。
    要使用v-model，您需要将带有结构的属性添加v-model="variable"到<input>.
    所以在我们的例子中，我们会将它添加到我们的new-todo-input字段中，如下所示。现在这样做： -->

    <!-- 注意：您还可以<input>通过事件和v-bind属性的组合将数据与值同步。事实上，这就是v-model幕后所做的事情。
    但是，确切的事件和属性组合因输入类型而异，并且比仅使用v-model快捷方式需要更多代码。 -->

    <!-- 与事件修饰符类似，我们也可以添加修饰符来改变v-model. 在我们的案例中，有两个值得考虑。第一个, .trim, 将删除输入之前或之后的空格。
    我们可以修改添加到我们的v-model语句，像这样：v-model.trim="label"。
    我们应该考虑的第二个修饰符叫做.lazy. 当v-model同步文本输入的值时，此修饰符会发生变化。如前所述，v-model同步通过使用事件更新变量来工作。
    对于文本输入，此同步使用inputevent 发生。通常，这意味着 Vue 在每次击键后都会同步数据。该.lazy修改将导致v-model使用该change事件来代替。
    这意味着 Vue 只会在输入失去焦点或提交表单时同步数据。
    就我们的目的而言，这更合理，因为我们只需要最终数据。
    要同时使用.lazy修饰符和.trim修饰符，我们可以将它们链接起来，例如v-model.lazy.trim="label"。
    将您的v-model属性更新为 chainlazy和trim如上所示，然后再次测试您的应用程序。例如，尝试提交一个两端带有空格的值。 -->

    <input
      type="text"
      id="new-todo-input"
      name="new-todo"
      autocomplete="off"
      v-model.lazy.trim="label"
      class="input__lg"
    />

    <!-- 在 Vue 中添加 CSS 类
    我们应该将按钮 CSS 类应用到<button>我们的ToDoForm组件中。
    由于 Vue 模板是有效的 HTML，因此这与在纯 HTML 中执行的方式相同——通过向class=""元素添加属性。
    添加class="btn btn__primary btn__lg"到您的表单<button>元素： -->
    <button type="submit" class="btn btn__primary btn__lg">Add</button>
  </form>
</template>

<script>
export default {
  methods: {
    onSubmit() {
      // 在我们继续之前，让我们做进一步的改进。如果您在输入为空时提交表单，没有文本的待办事项仍会添加到列表中。
      // 为了解决这个问题，我们可以防止在 name 为空时触发 todo- added 事件。
      // 由于 name 已经被.trim指令修剪，我们只需要测试空字符串。
      // 返回到您的ToDoForm组件，并onSubmit()像这样更新方法。如果标签值为空，我们就不要发出todo-added事件。
      if (this.label === "") {
        return;
      }

      // 让我们v-model通过记录在我们的onSubmit()方法中提交的数据的值来测试我们的使用。
      // 在组件中，使用this关键字访问数据属性。所以我们label使用this.label.
      // 将您的onSubmit()方法更新为如下所示：
      //   console.log("Label value: ", this.label);
      //   console.log("form submitted");

      // 我们现在非常接近能够将新的待办事项添加到我们的列表中。
      // 我们需要做的下一件事是将新创建的待办事项传递给我们的App组件。
      // 为此，我们可以让我们ToDoForm发出一个传递数据的自定义事件，并App监听它。
      // 这与 HTML 元素上的原生事件非常相似：子组件可以发出一个可以通过v-on.
      // 在onSubmit我们的事件中ToDoForm，让我们添加一个todo-added事件。
      // 自定义事件发出这样的：this.$emit("event-name")。
      // 重要的是要知道事件处理程序区分大小写并且不能包含空格。Vue 模板也会转换为小写，这意味着 Vue 模板无法侦听以大写字母命名的事件。
      // 替换console.log()在onSubmit()用下面的方法：
      // this.$emit("todo-added");

      // 当您提交ToDoForm时，您应该看到来自addToDo()方法的控制台日志。
      // 这很好，但我们仍然没有将任何数据传递回App.vue组件。
      // 我们可以通过向ToDoForm组件中的this.$emit()函数传递额外的参数来实现这一点。
      // 在本例中，当我们触发事件时，我们希望传递标签数据。
      // 这是通过在$emit()方法中包含要作为另一个参数传递的数据来实现的:this.$emit("todo-added", this.label)。
      // 这类似于原生 JavaScript 事件如何包含数据，除了自定义 Vue 事件默认不包含事件对象。
      // 这意味着发出的事件将直接匹配您提交的任何对象。
      // 所以在我们的例子中，我们的事件对象只是一个字符串。
      // onSubmit()像这样更新你的方法：
      this.$emit("todo-added", this.label);
      // 在我们的ToDoForm组件中还有一件事需要修复——提交后，<input>仍然包含旧值。
      // 但这很容易修复——因为我们使用v-model将数据绑定到<input>in ToDoForm，如果我们将 name 参数设置为等于一个空字符串，输入也会更新。
      // 将ToDoForm组件的onSubmit()方法更新为：
      this.label = "";
    },
  },
  // 我们需要的第一件事是data我们表单中的一个属性来跟踪待办事项的价值。
  // data()向我们的ToDoForm组件对象添加一个返回label字段的方法。我们可以将 的初始值设置为label空字符串。
  data() {
    return {
      label: "",
    };
  },
};
</script>