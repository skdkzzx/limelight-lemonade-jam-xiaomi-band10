import file from '@system.file'

export default class GameEngine {
  constructor() {
    this.scripts = {};
    this.isLoaded = false;
    this.loadPromise = null;
    this.chunkSize = 500;
    this.maxRetries = 2;
    this.retryDelay = 150;
    this.loadedChunks = {};
    this.currentChunk = 1;
    this.pendingLoads = {};
    this.totalScriptsCount = 0;
    this.lastMemoryCheck = 0;
  }

  async loadGameScript() {
    if (this.loadPromise) return this.loadPromise;
    if (this.isLoaded) return true;

    this.loadPromise = new Promise(async (resolve) => {
      try {
        this.scripts = {};
        this.loadedChunks = {};
        await this.loadMinimalChunk(1);
        this.isLoaded = true;
        resolve(true);
      } catch (error) {
        console.error('游戏脚本加载失败，使用备用脚本:', error);
        this.scripts = this.getEssentialScripts();
        this.isLoaded = true;
        resolve(true);
      } finally {
        this.loadPromise = null;
      }
    });

    return this.loadPromise;
  }

  async loadMinimalChunk(chunkNumber) {
    if (this.loadedChunks[chunkNumber]) return true;

    if (this.pendingLoads[chunkNumber]) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.loadedChunks[chunkNumber]) {
            clearInterval(checkInterval);
            resolve(true);
          }
        }, 50);
      });
    }

    this.pendingLoads[chunkNumber] = true;

    return new Promise((resolve) => {
      const fileName = `/common/script/scriptData${chunkNumber}.txt`;

      file.readText({
        uri: fileName,
        success: (data) => {
          try {
            const jsonText = typeof data === 'string' ? data : (data.text || '');
            const chunkScripts = this.parseChunkMinimal(jsonText, chunkNumber);
            this.addScriptsSparse(chunkScripts);
            this.loadedChunks[chunkNumber] = true;
            this.totalScriptsCount += Object.keys(chunkScripts).length;
            this.cleanupOldChunks(chunkNumber);
            resolve(true);
          } catch (error) {
            console.error(`处理块 ${chunkNumber} 失败:`, error);
            this.loadedChunks[chunkNumber] = true;
            resolve(false);
          } finally {
            delete this.pendingLoads[chunkNumber];
          }
        },
        fail: (error) => {
          console.error(`加载块 ${chunkNumber} 失败:`, error);
          this.loadedChunks[chunkNumber] = true;
          delete this.pendingLoads[chunkNumber];
          resolve(false);
        }
      });
    });
  }

  parseChunkMinimal(jsonText, chunkNumber) {
    if (!jsonText || jsonText.trim() === '') return {};

    let text = jsonText.trim();
    if (text.charCodeAt(0) === 0xFEFF) text = text.substring(1);

    if (text.startsWith('{') && text.endsWith('}')) {
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error(`解析块 ${chunkNumber} JSON失败:`, e);
        return {};
      }
    }
    return {};
  }

  addScriptsSparse(newScripts) {
    for (const key in newScripts) {
      if (newScripts.hasOwnProperty(key)) {
        this.scripts[key] = newScripts[key];
      }
    }
  }

  cleanupOldChunks(currentChunk) {
    const keepChunks = {
      [currentChunk]: true,
      [currentChunk - 1]: true,
      [currentChunk + 1]: true
    };

    for (const chunk in this.loadedChunks) {
      const chunkNum = parseInt(chunk);
      if (!keepChunks[chunkNum]) {
        this.removeChunkScripts(chunkNum);
        delete this.loadedChunks[chunk];
      }
    }
  }

  removeChunkScripts(chunkNumber) {
    const startId = (chunkNumber - 1) * this.chunkSize + 1;
    const endId = chunkNumber * this.chunkSize;

    for (let id = startId; id <= endId; id++) {
      const key = id.toString();
      if (this.scripts[key]) delete this.scripts[key];
    }
  }

  async smartLoadForProgress(progressId) {
    const targetChunk = Math.ceil(progressId / this.chunkSize);
    if (targetChunk !== this.currentChunk) this.currentChunk = targetChunk;

    if (!this.loadedChunks[targetChunk]) await this.loadMinimalChunk(targetChunk);

    const positionInChunk = progressId % this.chunkSize || this.chunkSize;

    // 预加载触发距离改为5，减少不必要的预加载
    if (positionInChunk >= this.chunkSize - 5) {
      const nextChunk = targetChunk + 1;
      if (!this.loadedChunks[nextChunk] && !this.pendingLoads[nextChunk]) {
        setTimeout(() => { this.loadMinimalChunk(nextChunk).catch(() => {}); }, 150);
      }
    } else if (positionInChunk <= 5 && targetChunk > 1) {
      const prevChunk = targetChunk - 1;
      if (!this.loadedChunks[prevChunk] && !this.pendingLoads[prevChunk]) {
        setTimeout(() => { this.loadMinimalChunk(prevChunk).catch(() => {}); }, 150);
      }
    }
  }

  async getScript(progressId) {
    const id = progressId.toString();

    if (!this.isLoaded) return this.getFallbackScript(progressId);

    await this.smartLoadForProgress(progressId);

    const script = this.scripts[id];
    if (!script) return this.getFallbackScript(progressId);

    return {
      id: progressId,
      background: script.b ? `/common/bcgi/${script.b}.jpg` : "",
      character: script.c ? `/common/cimg/${script.c}.png` : "",
      cg: script.cg ? `/common/evig/${script.cg}` : "",
      speaker: script.s || "",
      text: script.t || "",
      z: script.z || 0,
      choose: !!script.co,
      choose1: script.c1 || "",
      choose2: script.c2 || "",
      choose3: script.c3 || "",
      choose4: script.c4 || "",
      choose1To: script.c1t || progressId,
      choose2To: script.c2t || progressId,
      choose3To: script.c3t || progressId,
      choose4To: script.c4t || progressId
    };
  }

  getFallbackScript(progressId = 0) {
    return {
      id: progressId,
      background: "/common/bcgi/画面_白.jpg",
      character: "",
      cg: "",
      speaker: "系统",
      text: progressId > 0 ? `加载页面 ${progressId}` : "加载中...",
      z: 0,
      choose: false,
      choose1: "",
      choose2: "",
      choose3: "",
      choose4: "",
      choose1To: progressId || 0,
      choose2To: progressId || 0,
      choose3To: progressId || 0,
      choose4To: progressId || 0
    };
  }

  getEssentialScripts() {
    return {
      "1": { b: "演出_ライト2", s: "系统", t: "游戏启动中..." },
      "2": { b: "演出_ライト2", s: "", t: "请稍候..." },
      "3": { b: "演出_ライト2", s: "", t: "正在初始化..." }
    };
  }

  hasNext(progressId) {
    const nextId = (parseInt(progressId) + 1).toString();
    return this.scripts.hasOwnProperty(nextId);
  }

  getNextProgressId(progressId) {
    const nextId = parseInt(progressId) + 1;
    return this.scripts.hasOwnProperty(nextId.toString()) ? nextId : null;
  }

  getTotalProgress() {
    return this.totalScriptsCount;
  }

  forceCleanup() {
    const currentChunk = this.currentChunk;
    const keepStart = (currentChunk - 1) * this.chunkSize + 1;
    const keepEnd = currentChunk * this.chunkSize;

    const newScripts = {};
    let kept = 0;

    for (let id = keepStart; id <= keepEnd; id++) {
      const key = id.toString();
      if (this.scripts[key]) {
        newScripts[key] = this.scripts[key];
        kept++;
      }
    }

    this.scripts = newScripts;
    this.loadedChunks = { [currentChunk]: true };
    this.totalScriptsCount = kept;
  }

  getMemoryStatus() {
    const loadedChunksList = [];
    for (const chunk in this.loadedChunks) {
      loadedChunksList.push(parseInt(chunk));
    }

    return {
      loadedChunks: loadedChunksList.length,
      totalScripts: this.totalScriptsCount,
      currentChunk: this.currentChunk,
      memory: `${Math.round(this.totalScriptsCount * 0.3)}KB`
    };
  }

  async preloadRange(startId, endId) {
    const startChunk = Math.ceil(startId / this.chunkSize);
    const endChunk = Math.ceil(endId / this.chunkSize);
    const maxPreload = 3;
    let loaded = 0;

    for (let chunk = startChunk; chunk <= endChunk && loaded < maxPreload; chunk++) {
      if (!this.loadedChunks[chunk]) {
        await this.loadMinimalChunk(chunk);
        loaded++;
      }
    }
  }

  clearAll() {
    this.scripts = {};
    this.loadedChunks = {};
    this.pendingLoads = {};
    this.totalScriptsCount = 0;
  }
}
