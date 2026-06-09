import { DEFAULT_COVER } from "@/lib/constants";

export function createSeedPosts() {
  const now = Date.now();

  return [
    {
      id: "seed-lakeside-morning",
      title: "湖边清晨扎营，雾气像一层薄纱",
      body: "天刚亮的时候湖面还没有风，帐篷边的芦苇挂着露水。这个点最适合煮一壶咖啡，听水鸟叫几声，再慢慢收拾早餐。湖边湿气重，防潮垫和干燥袋一定要带。",
      images: ["/assets/camp-lakeside.png"],
      createdAt: now - 1000 * 60 * 28,
      likes: 24,
      comments: [
        {
          id: "comment-seed-1",
          nickname: "山野游客",
          content: "这种清晨湖边真的太治愈了，想立刻出发。",
          createdAt: now - 1000 * 60 * 12
        }
      ]
    },
    {
      id: "seed-forest-kitchen",
      title: "雨后林地厨房，热茶是最好的装备",
      body: "小雨停下以后，松针味特别明显。天幕下面只摆了一张桌子、炉具和水壶，动线简单反而更舒服。雨后地面偏软，桌脚最好垫一下，东西也别直接放地上。",
      images: ["/assets/camp-kitchen.png"],
      createdAt: now - 1000 * 60 * 76,
      likes: 17,
      comments: [
        {
          id: "comment-seed-2",
          nickname: "松针味",
          content: "雨后露营的味道确实很特别，装备少一点更轻松。",
          createdAt: now - 1000 * 60 * 36
        }
      ]
    },
    {
      id: "seed-meadow-evening",
      title: "山地草甸傍晚，帐篷旁边全是风",
      body: "营地在草甸边缘，视野很开阔，傍晚云层压过山脊的时候特别好看。这里风比林地大很多，搭帐篷时要把风绳全部拉好，夜里温差也明显。",
      images: ["/assets/camp-meadow.png"],
      createdAt: now - 1000 * 60 * 142,
      likes: 21,
      comments: []
    },
    {
      id: "seed-creek-valley",
      title: "溪谷边的午后，水声盖过了所有噪音",
      body: "溪水很浅，石头也平，午后坐在树荫里几乎不想说话。这个位置适合轻徒步后短暂停留，记得把帐篷扎在安全水位线外，晚上不要离溪流太近。",
      images: ["/assets/camp-creek.png"],
      createdAt: now - 1000 * 60 * 210,
      likes: 13,
      comments: [
        {
          id: "comment-seed-3",
          nickname: "溪边坐坐",
          content: "水位线提醒很有用，很多新手容易忽略。",
          createdAt: now - 1000 * 60 * 95
        }
      ]
    },
    {
      id: "seed-starlight-fire",
      title: "蓝调时刻点起营火，夜色刚刚好",
      body: "天完全黑下来之前，树林里还有一点蓝色。营火只需要小小一堆，照亮桌椅就够了。离开前一定要确认余烬彻底熄灭，安全比氛围重要。",
      images: ["/assets/camp-starlight.png"],
      createdAt: now - 1000 * 60 * 318,
      likes: 29,
      comments: []
    },
    {
      id: "seed-autumn-car-camp",
      title: "秋天车边露营，收纳顺手就很幸福",
      body: "车停在林间土路旁，后备箱打开就是临时操作台。秋天落叶多，拍照很好看，但炉具周围要保持干净，风大时也要避开枯叶堆。",
      images: ["/assets/camp-autumn-car.png"],
      createdAt: now - 1000 * 60 * 430,
      likes: 16,
      comments: []
    }
  ];
}
