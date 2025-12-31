
import { GoogleGenAI, Type } from "@google/genai";
import { Realm, EncounterResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `你是一个充满古风仙侠韵味的修仙游戏引擎。负责生成富有诗意、玄幻感的修仙文字描述。
当玩家进行“修炼”时，描述灵气的流动、感悟或肉身的变化。
当玩家“历练”时，描述奇遇、战斗或秘境寻宝。
所有输出必须是中文。
`;

export async function generateCultivationStory(realm: Realm, stage: number): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `描述我在[${realm}]境界[${stage}]重天的修炼过程，字数50字以内，充满仙气。`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    return response.text?.trim() || "你闭目冥想，感觉到一丝微弱的灵气汇入丹田。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "灵气汇聚，你感觉境界有所松动。";
  }
}

export async function generateEncounter(realm: Realm, luck: number): Promise<EncounterResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `我正在[${realm}]境界历练，我的气运值是[${luck}]。请生成一个随机事件。
      如果是好运，描述发现草药或灵石；如果是霉运，描述遇到妖兽或陷阱。`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            story: { type: Type.STRING, description: "事件的文字描述" },
            qiGain: { type: Type.NUMBER, description: "灵力收益(正数)" },
            healthLoss: { type: Type.NUMBER, description: "生命损失(正数)" },
            stonesFound: { type: Type.NUMBER, description: "发现的灵石数量" }
          },
          required: ["story"]
        }
      },
    });

    const data = JSON.parse(response.text || "{}");
    return {
      story: data.story || "你在山林间行走，并没有发现什么特别的。",
      qiGain: data.qiGain || 0,
      healthLoss: data.healthLoss || 0,
      stonesFound: data.stonesFound || 0
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { story: "你在密林中迷失了方向，好在平安无事。", qiGain: 5 };
  }
}

export async function generateBreakthroughMessage(current: Realm, next: Realm, success: boolean): Promise<string> {
  try {
    const prompt = success 
      ? `描述我从${current}成功突破到${next}的壮丽景象，雷劫、灵雨、心境提升。`
      : `描述我冲击${next}境界失败时的惨烈，心魔反噬、灵力紊乱，但终究保住一命。`;
      
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    return response.text?.trim() || (success ? "天降祥瑞，你突破了！" : "道心不稳，功败垂成。");
  } catch (error) {
    return success ? "突破成功！" : "突破失败！";
  }
}
