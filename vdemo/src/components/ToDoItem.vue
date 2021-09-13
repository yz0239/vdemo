<template>
  <!-- 这是用来存放自定义组件的目录，目前里面会有一个示例组件。 -->

  <!-- 现在我们需要在模板中添加一些CSS类来连接样式。
  在根中，添加一个自定义复选框类。在<input>中添加一个复选框类。最后，在<label>中添加一个checkbox-label类。更新后的模板如下:
  应用程序现在应该有自定义复选框。你的应用应该如下图所示。 -->
  <div class="stack-small" v-if="!isEditing">
    <div class="custom-checkbox">
      <input
        type="checkbox"
        :id="id"
        :checked="isDone"
        class="checkbox"
        @change="$emit('checkbox-changed')"
      />
      <label :for="id" class="checkbox-label">{{ label }}</label>
    </div>
    <div class="btn-group">
      <button
        type="button"
        class="btn"
        ref="editButton"
        @click="toggleToItemEditForm"
      >
        Edit <span class="visually-hidden">{{ label }}</span>
      </button>
      <button type="button" class="btn btn__danger" @click="deleteToDo">
        Delete <span class="visually-hidden">{{ label }}</span>
      </button>
    </div>
  </div>
  <to-do-item-edit-form
    v-else
    :id="id"
    :label="label"
    @item-edited="itemEdited"
    @edit-cancelled="editCancelled"
  >
  </to-do-item-edit-form>
</template>
<script>
// 我们现在可以将此包导入到我们的ToDoItem组件中。在ToDoItem.vue的<script>元素顶部添加以下行：
// import uniqueId from "lodash.uniqueid";

// 我们可以做一点代码重构。 因为我们已经要为每一个待办事项创建一个唯一id，所以不妨把id作为ToDoItem的一个prop，而不是在每个checkbox里生成它。
// 添加一个新的prop id 到 ToDoItem 组件。
// 标记它为required，类型是 String 。
// 为防止命名冲突，删除掉data属性中的id字段。
// 删除掉 import uniqueId from 'lodash.uniqueid'; 这行。
import ToDoItemEditForm from "./ToDoItemEditForm";

// 默认导出对象--组件对象
export default {
  components: {
    ToDoItemEditForm,
  },
  props: {
    // label键的值应该是一个具有2个属性的对象(或props，因为它们在组件可用的上下文中被调用)。
    // 第一个是required属性，其值为true。这将告诉 Vue 我们希望这个组件的每个实例都有一个标签字段。
    // 如果ToDoItem组件没有标签字段，Vue 会警告我们。
    // 我们要添加的第二个属性是一个type属性。将此属性的值设置为 JavaScriptString类型（注意大写的“S”）。
    // 这告诉 Vue 我们期望这个属性的值是一个字符串。
    label: { required: true, type: String },
    // 首先添加一个默认字段，值为false。
    // 这意味着当没有完成的道具被传递给ToDoItem组件时，完成的道具的值将为false(记住这不是必需的——我们只需要默认的非必需的道具)。
    // 接下来添加一个值为Boolean的类型字段。这告诉Vue，我们希望value prop是一个JavaScript布尔类型。
    done: { default: false, type: Boolean },
    id: { required: true, type: String },
  },
  // 您会注意到该data属性是一个函数。这是为了在运行时为组件的每个实例保持唯一的数据值 - 为每个组件实例单独调用该函数。
  // 如果您仅将数据声明为一个对象，则该组件的所有实例都将共享相同的值。
  // 这是 Vue 注册组件方式的副作用以及您不想要的东西。
  // 您可以使用this从内部数据访问组件的 props 和其他属性，如您可能希望。我们很快就会看到一个例子。
  // 注意：由于this箭头函数的工作方式（绑定到父级的上下文），data如果使用箭头函数，您将无法从内部访问任何必要的属性。
  // 所以不要对data属性使用箭头函数。
  // 所以让data我们为我们的ToDoItem组件添加一个属性。这将返回一个包含我们将调用的单个属性的对象isDone，其值为this.done。
  // 像这样更新组件对象：
  data() {
    return {
      // Vue 在这里做了一点魔法——它将所有的 props 直接绑定到组件实例，所以我们不必调用this.props.done.
      // 它也结合其他属性（data，您已经看到了，和其他人一样methods，computed等），直接到该实例。这部分是为了使它们可用于您的模板。
      // 这样做的缺点是您需要在这些属性中保持键的唯一性。这就是为什么我们称我们的data属性isDone而不是done.
      // 所以现在我们需要将isDone属性附加到我们的组件上。
      // 与 Vue 使用{{}}表达式在模板中显示 JavaScript 表达式的方式类似，
      // Vue 有一种特殊的语法来将 JavaScript 表达式绑定到 HTML 元素和组件：v-bind.
      // 该v-bind表达式如下所示：
      // v-bind:attribute="expression"
      // isDone: this.done,
      // 接下来，id向我们的数据属性添加一个字段，因此组件对象最终看起来像这样（uniqueId()返回指定的前缀 — todo-— 附加一个唯一的字符串）：
      //   id: uniqueId("todo-"),
      isEditing: false,
    };
  },
  computed: {
    isDone() {
      return this.done;
    },
  },
  methods: {
    deleteToDo() {
      this.$emit("item-deleted");
    },
    toggleToItemEditForm() {
      console.log(this.$refs.editButton);
      this.isEditing = true;
    },
    itemEdited(newLabel) {
      this.$emit("item-edited", newLabel);
      this.isEditing = false;
      this.focusOnEditButton();
    },
    editCancelled() {
      this.isEditing = false;
      this.focusOnEditButton();
    },
    focusOnEditButton() {
      this.$nextTick(() => {
        const editButtonRef = this.$refs.editButton;
        editButtonRef.focus();
        console.log(this);
      });
    },
  },
  // 给 Todos 一个唯一的 id
  // 伟大的！我们现在有一个可用的复选框，我们可以在其中以编程方式设置状态。
  // 但是，我们目前只能ToDoList向页面添加一个组件，因为id是硬编码的。
  // 这将导致辅助技术出错，因为id需要将标签正确映射到其复选框。
  // 为了解决这个问题，我们可以id在组件数据中以编程方式设置。
  // 我们可以使用 洛达什包的uniqueid()方法来帮助保持索引的唯一性。
  // 这个包导出一个函数，它接受一个字符串并在前缀的末尾附加一个唯一的整数。这足以保持组件id的唯一性。
  // 让我们使用 npm 将包添加到我们的项目中；停止服务器并在终端中输入以下命令：
  // npm install --save lodash.uniqueid
  // 注意：如果你更喜欢 yarn，你可以使用yarn add lodash.uniqueid.

  // 总结
  // 这篇文章就到此为止。
  // 此时，我们有了一个工作良好的ToDoItem组件，它可以被传递一个标签来显示，它将存储它的检查状态，并在每次调用时使用唯一的id进行渲染。
  // 你可以通过临时添加更多的<to-do-item></to-do-item>调用到App.vue来检查唯一id是否有效，然后用你的浏览器的DevTools检查它们的渲染输出。
  // 现在我们已经准备好向App中添加多个ToDoItem组件了。
  // 在下一篇文章中，我们将看看如何向App.vue组件中添加一组todo项目数据，然后我们将对其进行循环
};
</script>
<style scoped>
/* 添加范围样式
我们想要设置样式的最后一个组件是我们的ToDoItem组件。为了使样式定义靠近组件，我们可以在其中添加一个<style>元素。
但是，如果这些样式改变了该组件之外的内容，则追踪相关样式并解决问题可能具有挑战性。
这就是scoped属性有用的地方——这将一个唯一的 HTMLdata属性选择器附加到您的所有样式，防止它们全局冲突。
要使用scoped修饰符，请<style>在ToDoItem.vue, 在文件底部创建一个元素，并为其指定一个scoped属性： */

.custom-checkbox > .checkbox-label {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 400;
  font-size: 16px;
  font-size: 1rem;
  line-height: 1.25;
  color: #0b0c0c;
  display: block;
  margin-bottom: 5px;
}
.custom-checkbox > .checkbox {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 400;
  font-size: 16px;
  font-size: 1rem;
  line-height: 1.25;
  box-sizing: border-box;
  width: 100%;
  height: 40px;
  height: 2.5rem;
  margin-top: 0;
  padding: 5px;
  border: 2px solid #0b0c0c;
  border-radius: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
.custom-checkbox > input:focus {
  outline: 3px dashed #fd0;
  outline-offset: 0;
  box-shadow: inset 0 0 0 2px;
}
.custom-checkbox {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  font-weight: 400;
  font-size: 1.6rem;
  line-height: 1.25;
  display: block;
  position: relative;
  min-height: 40px;
  margin-bottom: 10px;
  padding-left: 40px;
  clear: left;
}
.custom-checkbox > input[type="checkbox"] {
  -webkit-font-smoothing: antialiased;
  cursor: pointer;
  position: absolute;
  z-index: 1;
  top: -2px;
  left: -2px;
  width: 44px;
  height: 44px;
  margin: 0;
  opacity: 0;
}
.custom-checkbox > .checkbox-label {
  font-size: inherit;
  font-family: inherit;
  line-height: inherit;
  display: inline-block;
  margin-bottom: 0;
  padding: 8px 15px 5px;
  cursor: pointer;
  touch-action: manipulation;
}
.custom-checkbox > label::before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border: 2px solid currentColor;
  background: transparent;
}
.custom-checkbox > input[type="checkbox"]:focus + label::before {
  border-width: 4px;
  outline: 3px dashed #228bec;
}
.custom-checkbox > label::after {
  box-sizing: content-box;
  content: "";
  position: absolute;
  top: 11px;
  left: 9px;
  width: 18px;
  height: 7px;
  transform: rotate(-45deg);
  border: solid;
  border-width: 0 0 5px 5px;
  border-top-color: transparent;
  opacity: 0;
  background: transparent;
}
.custom-checkbox > input[type="checkbox"]:checked + label::after {
  opacity: 1;
}
@media only screen and (min-width: 40rem) {
  label,
  input,
  .custom-checkbox {
    font-size: 19px;
    font-size: 1.9rem;
    line-height: 1.31579;
  }
}
</style>