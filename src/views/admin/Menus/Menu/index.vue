<template>
  <a-spin :spinning="menuFetching">
    <a-card>
      <h4 v-if="type === 'BOOK'" slot="title">{{ $t("menu.MENU_BOOK" )}}</h4>
      <h4 v-else slot="title">{{ $t("menu.MENU_COURSE" )}}</h4>
      <a-row :gutter="16">
        <a-col :lg="{ span: 12, offset: 6 }">
          <a-button class="mr-2 mb-2" type="danger" size="small" @click="onCollapseAll">
            <a-icon type="vertical-align-middle" />
            {{$t('shared.COLLAPSE_ALL')}}
          </a-button>
          <a-button class="mr-2 mb-2" type="danger" size="small" @click="onExpandAll">
            <a-icon type="column-height" />
            {{$t('shared.EXPAND_ALL')}}
          </a-button>
          <a-button class="mr-2 mb-2" type="success" size="small" @click="openBlockAdd = true">
            <a-icon type="plus" />
            {{$t('shared.ADD')}}
          </a-button>
          <a-button class="mb-2" type="warning" size="small" @click="onDeleteMenu">
            <a-icon type="delete" />
            {{$t('shared.DELETE')}}
          </a-button>
          <div class="my-1" v-if="openBlockAdd">
            <a-select
              v-model="category"
              :placeholder="$t('menus.SELECT_ONE_CATEGORY')"
              class="mb-3"
              allowClear
              style="width: 100%"
            >
              <a-select-option
                v-for="item in allCategories"
                :key="item.id"
                :value="item.id"
              >{{item.name}}</a-select-option>
            </a-select>
            <div>
              <a-button
                id="add"
                class="mr-2"
                type="primary"
                size="small"
                @click="onAddMenu"
                :disabled="!category"
              >{{$t('shared.SUBMIT')}}</a-button>
              <a-button size="small" @click="openBlockAdd = false">{{$t('shared.CANCEL')}}</a-button>
            </div>
          </div>
          <a-tree
            showLine
            draggable
            :treeData="gData"
            :replaceFields="{ key: 'id', title: 'name' }"
            :expandedKeys="expandedKeys"
            @expand="onExpand"
            @drop="onDrop"
            @select="onSelect"
          />
        </a-col>
      </a-row>
    </a-card>
  </a-spin>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { menu } from "./mock";
import treeHelpers from "@/helpers/tree";

export default {
  props: {
    type: {
      type: String,
      default: "BOOK"
    }
  },
  created() {
    this.fetchMenuTree();
  },
  data() {
    return {
      arrayPrimitive: menu,
      gData: [],
      expandedKeys: [],
      openBlockAdd: false,
      nodeSelected: null,
      category: undefined
    };
  },
  computed: {
    ...mapGetters("moduleAdmin/common", ["allCategories"]),
    ...mapGetters("moduleAdmin/menu", ["menuError", "menuFetching"])
  },
  methods: {
    ...mapActions("moduleAdmin/menu", [
      "getMenuTree",
      "addMenu",
      "updateMenu",
      "deleteMenu"
    ]),
    async fetchMenuTree() {
      const res = await this.getMenuTree(this.type);
      if (res) {
        const { menus } = res;
        this.arrayPrimitive = menus;
        this.gData = treeHelpers.arrayToTreeV2(menus) || [];
        this.category = undefined;
      } else {
        if (this.menuError) {
          this.$notification.error({
            message: this.$t("error.UNKNOWN_ERROR")
          });
        }
      }
    },
    onExpandAll() {
      this.expandedKeys = this.arrayPrimitive.map(item => item.id);
    },
    onCollapseAll() {
      this.expandedKeys = [];
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
    },
    onSelect(selectedKeys) {
      if (selectedKeys.length) {
        this.nodeSelected = selectedKeys[0];
      } else {
        this.nodeSelected = null;
      }
    },
    onAddMenu() {
      let content;
      if (this.nodeSelected) {
        content = this.$t("menus.WARNING_ADD_MENU_SELECT_PARENT_MENU");
      } else {
        content = this.$t("menus.WARNING_ADD_MENU_NO_SELECT_PARENT_MENU");
      }
      this.$confirm({
        title: this.$t("shared.CONFIRM"),
        content: <strong class="text-danger">{content}</strong>,
        onOk: async () => {
          const data = [...this.gData];
          let addItem,
            updateItem = null,
            upAddObj = null,
            parentUpdate = null;
          if (this.nodeSelected) {
            treeHelpers.loop(data, this.nodeSelected, item => {
              parentUpdate = item;
            });
            if (!parentUpdate) {
              addItem = {
                categoryId: this.category,
                parentId: null,
                leftId: null,
                rightId: null,
                type: this.type
              };
            } else if ((parentUpdate.children || []).length) {
              upAddObj =
                parentUpdate.children[parentUpdate.children.length - 1];
              addItem = {
                categoryId: this.category,
                parentId: parentUpdate.id,
                leftId: upAddObj.id,
                rightId: null,
                type: this.type
              };
              updateItem = {
                id: upAddObj.id,
                updatePosition: "rightId"
              };
            } else {
              addItem = {
                categoryId: this.category,
                parentId: parentUpdate.id,
                leftId: null,
                rightId: null,
                type: this.type
              };
            }
          } else {
            if (data.length) {
              upAddObj = data[data.length - 1];
              addItem = {
                categoryId: this.category,
                parentId: null,
                leftId: upAddObj.id,
                rightId: null,
                type: this.type
              };
              updateItem = {
                id: upAddObj.id,
                updatePosition: "rightId"
              };
            } else {
              addItem = {
                categoryId: this.category,
                parentId: null,
                leftId: null,
                rightId: null,
                type: this.type
              };
            }
          }
          // console.log(addItem, updateItem);
          const res = await this.addMenu({ addItem, updateItem });
          if (res) {
            this.$notification.success({
              message: this.$t("shared.CREATE_SUCCESS")
            });
            this.fetchMenuTree();
          } else {
            this.$notification.error({
              message: this.$t(this.menuError)
            });
          }
        }
      });
    },
    onDeleteMenu() {
      if (!this.nodeSelected) {
        this.$message.warning(
          this.$t("menus.PLEASE_SELECT_ONE_MENU_TREE_TO_REMOVE")
        );
        return;
      }
      this.$confirm({
        title: this.$t("shared.CONFIRM"),
        content: (
          <strong class="text-danger">
            {this.$t("menus.WARNING_DELETE_MENU")}
          </strong>
        ),
        onOk: async () => {
          console.log(this.gData);
          const data = [...this.gData];
          let itemDelete,
            upDeleteObj = null,
            downDeleteObj = null;
          treeHelpers.loop(data, this.nodeSelected, (item, index, arr) => {
            itemDelete = item;
            if (index > 0) {
              upDeleteObj = arr[index - 1];
            }
            if (index < arr.length - 1) {
              downDeleteObj = arr[index + 1];
            }
          });
          const deleteIds = treeHelpers
            .convertTreeToList(itemDelete)
            .map(item => item.id);
          const updateItems = treeHelpers.getItemUpdateWhenDelete(
            upDeleteObj,
            downDeleteObj
          );
          console.log(deleteIds, updateItems);
          const res = await this.deleteMenu({ deleteIds, updateItems });
          if (res) {
            this.$notification.success({
              message: this.$t("shared.DELETE_SUCCESS")
            });
            await this.fetchMenuTree();
          } else {
            this.$notification.error({
              message: this.$t(this.menuError)
            });
          }
        }
      });
    },
    async onDrop(info) {
      const dropKey = info.node.eventKey;
      const dragKey = info.dragNode.eventKey;
      const dropPos = info.node.pos.split("-");
      const dropPosition =
        info.dropPosition - Number(dropPos[dropPos.length - 1]);
      const data = [...this.gData];

      // Find dragObject
      let dragObj,
        upDragObj = null,
        downDragObj = null;
      treeHelpers.loop(data, dragKey, (item, index, arr) => {
        dragObj = item;
      });
      treeHelpers.loop(data, dragKey, (item, index, arr) => {
        if (index > 0) {
          upDragObj = arr[index - 1];
        }
      });
      treeHelpers.loop(data, dragKey, (item, index, arr) => {
        if (index < arr.length - 1) {
          downDragObj = arr[index + 1];
        }
      });
      let parentDropObj = null,
        upDropObj = null,
        downDropObj = null;
      if (!info.dropToGap) {
        treeHelpers.loop(data, dropKey, (item, index, arr) => {
          parentDropObj = { ...item };
          if (item.children) {
            upDropObj = item.children[item.children.length - 1];
          }
        });
      } else {
        treeHelpers.loop(data, dropKey, (item, index, arr) => {
          if (dropPosition === -1) {
            downDropObj = item;
            if (item.parentId !== 0) {
              treeHelpers.loop(data, item.parentId, item => {
                parentDropObj = { ...item };
              });
            }
            if (index > 0) {
              upDropObj = arr[index - 1];
            }
          } else {
            upDropObj = item;
            if (item.parentId !== 0) {
              treeHelpers.loop(data, item.parentId, item => {
                parentDropObj = { ...item };
              });
            }
            if (index < arr.length - 1) {
              downDropObj = arr[index + 1];
            }
          }
        });
      }
      const updateItems = treeHelpers.getItemUpdateTree(
        dragObj,
        upDragObj,
        downDragObj,
        upDropObj,
        downDropObj,
        parentDropObj
      );
      console.log(updateItems);
      // Todo: CALL API UPDATE
      const res = await this.updateMenu(updateItems);
      if (res) {
        this.$notification.success({
          message: this.$t("shared.UPDATE_SUCCESS")
        });
        this.fetchMenuTree();
      } else {
        this.$notification.error({
          message: this.$t(this.menuError)
        });
      }
    }
  }
};
</script>