# 代码架构优化文档

## 📁 新的项目结构

```
src/
├── components/           # UI组件目录
│   ├── StatusBar.tsx         # 状态栏组件（已存在）
│   ├── EventDialog.tsx       # 事件对话框（已存在）
│   ├── LandingPage.tsx       # 🆕 首页组件
│   ├── AchievementModal.tsx  # 🆕 成就弹窗组件
│   ├── QuizModal.tsx         # 🆕 问答弹窗组件
│   ├── ShoppingPage.tsx      # 🆕 商店页面组件
│   └── GameOverModal.tsx     # 🆕 游戏结束弹窗
├── hooks/                # 自定义Hooks目录
│   ├── useGameLogic.ts       # 🆕 游戏逻辑Hook
│   └── useQuiz.ts            # 🆕 问答系统Hook
├── services/             # 服务层
│   └── geminiService.ts      # AI叙事服务
├── App.tsx               # ✨ 主应用（已优化）
├── types.ts              # 类型定义
└── constants.ts          # 常量配置
```

## 🎯 优化目标

### 之前的问题
- ❌ App.tsx文件过大（1300+行）
- ❌ UI、逻辑、状态管理混在一起
- ❌ 代码难以维护和测试
- ❌ 组件无法复用

### 优化后的优势
- ✅ 组件化架构，每个组件职责单一
- ✅ 自定义Hooks封装可复用逻辑
- ✅ 代码结构清晰，易于维护
- ✅ 便于单元测试
- ✅ 支持按需加载

## 📦 新组件说明

### 1. LandingPage 组件
**文件:** `components/LandingPage.tsx`  
**职责:** 游戏首页UI渲染  
**Props:**
- `gameState` - 游戏状态
- `onSeasonChange` - 季节选择回调
- `onStartShopping` - 开始购物回调
- `onShowAchievements` - 显示成就回调
- `onShowQuiz` - 显示问答回调

### 2. AchievementModal 组件
**文件:** `components/AchievementModal.tsx`  
**职责:** 成就系统弹窗  
**Props:**
- `show` - 是否显示
- `achievements` - 成就列表
- `language` - 当前语言
- `onClose` - 关闭回调

### 3. QuizModal 组件
**文件:** `components/QuizModal.tsx`  
**职责:** 问答系统完整UI（题目+结果）  
**Props:**
- `show` - 是否显示
- `showResult` - 是否显示结果
- `questions` - 题目列表
- `currentIndex` - 当前题目索引
- `answers` - 用户答案
- `onAnswer` - 回答回调
- `onNext/onPrevious` - 翻页回调
- `onSubmit` - 提交回调

### 4. ShoppingPage 组件
**文件:** `components/ShoppingPage.tsx`  
**职责:** 商店页面完整UI  
**Props:**
- `gameState` - 游戏状态
- `shoppingCart` - 购物车
- `activeCategory` - 当前分类
- `onCategoryChange` - 分类切换
- `onAddToCart` - 添加购物车
- `onStartJourney` - 开始旅程

### 5. GameOverModal 组件
**文件:** `components/GameOverModal.tsx`  
**职责:** 游戏结束弹窗  
**Props:**
- `gameState` - 游戏状态
- `landmarks` - 地标列表
- `onResetToHome` - 返回首页回调

## 🎣 自定义Hooks说明

### useGameLogic Hook
**文件:** `hooks/useGameLogic.ts`  
**功能:** 封装游戏核心逻辑  
**导出方法:**
- `calculateWeight(inventory)` - 计算负重
- `hasItem(inventory, itemId)` - 检查物品
- `useItem(inventory, itemId)` - 使用物品
- `addItem(inventory, item, quantity)` - 添加物品

**使用示例:**
```typescript
const { calculateWeight, hasItem } = useGameLogic();
const weight = calculateWeight(gameState.inventory);
const hasTent = hasItem(gameState.inventory, 'g2');
```

### useQuiz Hook
**文件:** `hooks/useQuiz.ts`  
**功能:** 封装问答系统状态和逻辑  
**导出状态:**
- `showQuiz` - 是否显示问答
- `currentQuizIndex` - 当前题号
- `quizAnswers` - 答案数组
- `showQuizResult` - 是否显示结果

**导出方法:**
- `handleAnswer(index)` - 记录答案
- `handleNext()` - 下一题
- `handlePrevious()` - 上一题
- `handleSubmit()` - 提交答案
- `handleStartQuiz()` - 开始问答
- `handleCloseQuiz()` - 关闭问答

## 🔄 App.tsx 优化

### 代码量对比
- **优化前:** ~1300行
- **优化后:** ~900行（减少30%+）

### 主要改进
1. **UI组件抽离:** Landing、Shopping、Achievement、Quiz、GameOver
2. **逻辑Hook化:** 游戏逻辑和问答逻辑独立封装
3. **状态管理优化:** 使用自定义Hook管理局部状态
4. **代码可读性提升:** 主文件只保留核心游戏流程

### 新的App.tsx结构
```typescript
App.tsx
├── 状态声明
│   ├── gameState (主游戏状态)
│   ├── currentEvent (当前事件)
│   ├── showAchievements (成就显示)
│   └── shoppingCart (购物车)
├── 自定义Hooks
│   ├── useGameLogic() (游戏逻辑)
│   └── useQuiz() (问答系统)
├── 核心游戏逻辑
│   ├── settleAchievements (成就结算)
│   ├── updateStatus (状态更新)
│   ├── checkGameOver (游戏结束检查)
│   └── handleExplore (探索逻辑)
└── 渲染层
    ├── Landing阶段 → LandingPage组件
    ├── Shopping阶段 → ShoppingPage组件
    └── Hiking阶段 → 保留内联（核心玩法）
```

## 🚀 迁移指南

### 如何添加新组件
1. 在 `components/` 目录创建新文件
2. 定义Props接口
3. 实现组件逻辑
4. 在App.tsx中导入并使用

### 如何添加新Hook
1. 在 `hooks/` 目录创建新文件
2. 使用 `use` 前缀命名
3. 返回状态和方法
4. 在需要的地方调用

### 示例：添加新的设置组件
```typescript
// 1. 创建 components/SettingsModal.tsx
interface SettingsModalProps {
  show: boolean;
  onClose: () => void;
  onLanguageChange: (lang: Language) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ ... }) => {
  // 组件实现
};

// 2. 在App.tsx中使用
import SettingsModal from './components/SettingsModal';

const [showSettings, setShowSettings] = useState(false);

return (
  <>
    <SettingsModal 
      show={showSettings} 
      onClose={() => setShowSettings(false)}
      onLanguageChange={...}
    />
    ...
  </>
);
```

## 📊 性能优化

### 代码分割
- 每个组件独立文件，支持懒加载
- 减少初始包体积

### 状态隔离
- 局部状态由组件/Hook管理
- 减少不必要的重渲染

### 可测试性
- 组件可独立测试
- Hook可单独mock

## 🔧 维护建议

1. **保持单一职责:** 每个组件只做一件事
2. **Props类型化:** 使用TypeScript接口定义Props
3. **逻辑分离:** UI和业务逻辑分开
4. **命名规范:** 组件用PascalCase，Hook用camelCase
5. **文档更新:** 添加新功能时更新此文档

## ✅ 编译验证

所有新组件和Hooks已通过TypeScript编译检查：
- ✅ LandingPage.tsx
- ✅ AchievementModal.tsx
- ✅ QuizModal.tsx  
- ✅ ShoppingPage.tsx
- ✅ GameOverModal.tsx
- ✅ useGameLogic.ts
- ✅ useQuiz.ts
- ✅ App.tsx (优化后)

功能完全保持不变，只是代码组织更加合理！
