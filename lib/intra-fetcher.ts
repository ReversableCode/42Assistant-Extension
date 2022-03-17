import moment from "moment";
import colorize from "color";

import { getHTML, getJSON } from "./fetch.helper";
import getUserLogtime from "./logtime-calculator";

export async function init42IntraProfile(loginId?: string) {
  const profile: Intra42Profile = {
    login: loginId || "",
    fullName: "",
    avatarUrl: "",
    displayName: "",

    isAvailable: false,
    availableAt: "-",

    currentCursus: null,
    availableCursus: [],

    wallet: "",
    evaluationPoints: "",
  };

  try {
    const data = await getHTML(
      loginId
        ? `https://profile.intra.42.fr/users/${loginId}.html`
        : "https://profile.intra.42.fr/"
    );

    profile.login =
      data.querySelector(".login")?.getAttribute("data-login") || "";
    profile.displayName = (
      data.querySelector(".login")?.textContent || ""
    ).trim();
    profile.fullName = (data.querySelector(".name")?.textContent || "").trim();
    profile.avatarUrl = `https://profile.intra.42.fr/users/${profile.login}/photo`;

    profile.isAvailable =
      (
        data.querySelector(".user-poste-status")?.textContent || "Unavailable"
      ).trim() !== "Unavailable";
    profile.availableAt = (
      data.querySelector(".user-poste-infos")?.textContent || "-"
    ).trim();

    profile.wallet = (
      data.querySelector(".user-wallet-value")?.textContent || "0 ₳"
    ).trim();
    profile.evaluationPoints = (
      data.querySelector(".user-correction-point-value")?.textContent || "0"
    ).trim();

    const availableCursus = data.getElementsByClassName("cursus-user-select")?.[0]?.children;
    if (availableCursus) {
      for (let i = 0; i < availableCursus.length; i++) {
        const cursus = availableCursus[i] as HTMLOptionElement;

        if (!cursus.value) continue;

        const levelElement = data.querySelector(
          `a.progress-container[data-cursus='${cursus.value}']`
        );
        profile.availableCursus.push({
          id: cursus.value || "",
          name: cursus.textContent || "",
          grade: (
            data
              .querySelector(
                `.user-grade.user-inline-stat[data-cursus='${cursus.value}']`
              )
              ?.getElementsByClassName("user-grade-value")?.[0]?.textContent || ""
          ).trim(),
          level:
            levelElement?.getElementsByClassName("on-progress")?.[0]
              ?.textContent || "Level 0 - 0%",
          progress:
            (
              levelElement?.getElementsByClassName(
                "progress-bar"
              )?.[0] as HTMLElement
            )?.style?.width || "0%",
          coalition: "",
          coalitionURL: "",

          bhDate: undefined,
          singularity: undefined,

          rank: "0",
          score: "0",

          backgroundColor: "rgb(0, 186, 188)",
          backgroundImage: "/images/default-bg.jpg",
          coalitionLogo: "",
        });

        if (cursus.selected) profile.currentCursus = profile.availableCursus[i];
      }
    } else {
      const cursusId = data.querySelector(".user-cursus")?.getAttribute("data-cursus-id") || "";
      
      if (cursusId) {
        const levelElement = data.querySelector(
          `a.progress-container[data-cursus='${cursusId}']`
        );
  
        profile.availableCursus.push({
          id: cursusId,
          name: (data.querySelector(".user-cursus")?.textContent || "").trim(),
          grade: (
            data
              .querySelector(
                `.user-grade.user-inline-stat[data-cursus='${cursusId}']`
              )
              ?.getElementsByClassName("user-grade-value")?.[0]?.textContent || ""
          ).trim(),
          level:
            levelElement?.getElementsByClassName("on-progress")?.[0]
              ?.textContent || "Level 0 - 0%",
          progress:
            (
              levelElement?.getElementsByClassName(
                "progress-bar"
              )?.[0] as HTMLElement
            )?.style?.width || "0%",
          coalition: "",
          coalitionURL: "",

          bhDate: undefined,
          singularity: undefined,

          rank: "0",
          score: "0",

          backgroundColor: "rgb(0, 186, 188)",
          backgroundImage: "/images/default-bg.jpg",
          coalitionLogo: "",
        });

        profile.currentCursus = profile.availableCursus[0];
      }
    }

    if (profile.currentCursus) {
      const { coalitions_user, available_blocs }: any = await getJSON(
        `https://profile.intra.42.fr/users/${profile.login}/coalitions?cursus=${profile.currentCursus?.id}`
      );

      profile.currentCursus.coalition = coalitions_user?.coalition?.name || "";
      profile.currentCursus.coalitionURL = `blocs/${available_blocs?.[0]?.id}/coalitions/${coalitions_user?.coalition?.id}`;
      profile.currentCursus.coalitionLogo = coalitions_user?.coalition?.image_url || "";
      profile.currentCursus.backgroundColor = coalitions_user?.coalition?.color || "rgb(0, 186, 188)";
      profile.currentCursus.backgroundImage = coalitions_user?.coalition?.cover_url || "/images/default-bg.jpg";
      profile.currentCursus.rank = `${coalitions_user?.rank || 0}`;
      profile.currentCursus.score = `${coalitions_user?.score || 0}`;

      try {
        const bhData: any = await getJSON(
          `https://profile.intra.42.fr/users/${profile.login}/goals?cursus=${profile.currentCursus?.id}`
        );

        profile.currentCursus.bhDate = bhData?.date || undefined;
        profile.currentCursus.singularity = bhData?.singularity || undefined;
      } catch (error) {
        console.error("An unexpected error occured:", error);
      }
    }

    return profile;
  } catch (error) {
    console.error("An unexpected error occured:", error);
    return null;
  }
}

export async function loadCoalitionByCursusId(id: string, profile: Intra42Profile) {
  const p_copy = Object.assign({}, profile);

  try {
    p_copy.currentCursus = p_copy.availableCursus.find((c) => c.id === id) || null;

    if (p_copy.currentCursus) {
      const { coalitions_user, available_blocs }: any = await getJSON(
        `https://profile.intra.42.fr/users/${p_copy.login}/coalitions?cursus=${id}`
      );

      p_copy.currentCursus.coalition = coalitions_user?.coalition?.name || "";
      p_copy.currentCursus.coalitionURL = `blocs/${available_blocs?.[0]?.id}/coalitions/${coalitions_user?.coalition?.id}`;
      p_copy.currentCursus.coalitionLogo = coalitions_user?.coalition?.image_url || "";
      p_copy.currentCursus.backgroundColor = coalitions_user?.coalition?.color || "rgb(0, 186, 188)";
      p_copy.currentCursus.backgroundImage = coalitions_user?.coalition?.cover_url || "/images/default-bg.jpg";
      p_copy.currentCursus.rank = `${coalitions_user?.rank || 0}`;
      p_copy.currentCursus.score = `${coalitions_user?.score || 0}`;

      try {
        const bhData: any = await getJSON(
          `https://profile.intra.42.fr/users/${p_copy.login}/goals?cursus=${id}`
        );

        p_copy.currentCursus.bhDate = bhData?.date || undefined;
        p_copy.currentCursus.singularity = bhData?.singularity || undefined;
      } catch (error) {
        console.error("An unexpected error occured:", error);
      }
    }

    return p_copy;
  } catch (error) {
    console.error("An unexpected error occured:", error);
    return null;
  }
}

export class LocationGraph {
  private SQUARE_SIZE = 0;
  private COL_SIZE = 0;
  private MONTH_OFFSET = 0;
  private LEGEND_HEIGHT = 0;
  private BG_COLOR = "#fff";

  private days_history = 0;
  private min_month = 0;
  private min_year = 0;

  private ns = "http://www.w3.org/2000/svg";
  private svg: HTMLElement | null = null;
  private histo: { [x: string]: string } = {};

  private max = 0;
  private coalitionColor = "rgba(0, 186, 188, 100)";

  private loginId = "";

  constructor(color?: string, loginId?: string) {
    this.loginId = loginId || "";
    this.coalitionColor = color || "rgba(0, 186, 188, 100)";
    this.SQUARE_SIZE = 18;
    this.COL_SIZE = 7;
    this.MONTH_OFFSET = this.SQUARE_SIZE * this.COL_SIZE + this.SQUARE_SIZE;
    this.LEGEND_HEIGHT = 40;
    this.BG_COLOR = "#ffffff00";
    const duration = moment.duration(
      moment().diff(moment().subtract(2, "month"))
    );
    const offset_day = new Date(Date.now()).getDate();
    this.days_history = duration.asDays() + (offset_day < 31 ? offset_day : 0);
    this.min_month = moment().subtract(this.days_history, "days").month();
    this.min_year = moment().subtract(this.days_history, "days").year();
  }
  month_offset(month: number, year: number) {
    return (
      (month - this.min_month) * this.MONTH_OFFSET +
      this.MONTH_OFFSET * 12 * (year - this.min_year)
    );
  }

  draw() {
    let c = 0;
    let _old_month = -1;
    this.svg?.setAttribute("viewBox", "162 0 415 160");
    this.svg?.setAttribute("preserveAspectRatio", "xMinYMin meet");

    Object.entries(this.histo).reverse().forEach(([k, v]) => {
      const [year, month, day] = k.split("#");

      if (parseInt(month) != _old_month) {
        this._draw_legend(parseInt(month), parseInt(year));
        c = moment({
          month: parseInt(month),
          year: parseInt(year),
        })
          .startOf("day")
          .day();
      } else c += 1;
      const x =
        this.SQUARE_SIZE +
        parseInt("" + (c % this.COL_SIZE)) * this.SQUARE_SIZE +
        this.month_offset(parseInt(month), parseInt(year));
      const y = parseInt("" + (c / this.COL_SIZE)) * this.SQUARE_SIZE;
      if (parseInt(v) != 0 && parseInt(v.split(":")[0]) >= 24) {
        v = "24:00:00";
        this._drawDay(
          x,
          y,
          this.coalitionColor,
          day,
          this.max * 100,
          moment(v, "HH:mm:ss")
        );
        _old_month = parseInt(month);
      } else {
        const vv = moment(v, "HH:mm:ss");
        const nbr_seconds = vv.hour() * 3600 + vv.minutes() * 60 + vv.seconds();
        const cr = ((nbr_seconds * 100) / this.max) || 0;
        const color =
          cr == 0 ? this.BG_COLOR : colorize(this.coalitionColor).fade(1 - (cr / 100)).toString();
        this._drawDay(x, y, color, day, nbr_seconds, vv);
        _old_month = parseInt(month);
      }
    });
  }
  fetchDataAndDraw(color?: string, loginId?: string) {
    this.loginId = loginId || "";
    this.coalitionColor = color || "rgba(0, 186, 188, 100)";

    this.ns = "http://www.w3.org/2000/svg";
    this.svg = document.getElementById("user-locations");
    const url = `https://profile.intra.42.fr/users/${this.loginId}/locations_stats`;

    getJSON(url).then((data: { [x: string]: string }) => {
      getUserLogtime(data);
      this.histo = this._getDatesArray(
        Object.entries(data).reduce((acc: any, [k, v]) => {
          var m = moment(k, "YYYY-MM-DD HH:mm:ss Z");
          acc[m.month() + "#" + m.date()] = v;
          return acc;
        }, {})
      );
      this.max = 24 * 60 * 60;
      this.draw();
    });
  }
  _getDatesArray(histo: { [x: string]: string }) {
    this.histo = histo;
    let now = moment();
    histo = {};
    let num = 0;
    while (num < this.days_history) {
      histo[now.year() + "#" + now.month() + "#" + now.date()] =
        this.histo[now.month() + "#" + now.date()] || "0";
      now = now.subtract(1, "days");
      num += 1;
    }
    return histo;
  }
  _draw_legend(month: number, year: number) {
    const index =
      this.SQUARE_SIZE +
      this.month_offset(month, year) +
      (this.COL_SIZE * this.SQUARE_SIZE) / 2;
    const text = document.createElementNS(this.ns, "text");
    text.innerHTML = moment({
      month: month,
    }).format("MMM");
    text.setAttributeNS(null, "x", "" + index);
    text.setAttributeNS(null, "y", "" + (this.LEGEND_HEIGHT / 2));
    text.setAttributeNS(null, "fill", "#999");
    text.setAttributeNS(null, "width", "" + this.COL_SIZE * this.SQUARE_SIZE);
    text.setAttributeNS(null, "height", "" + this.COL_SIZE * this.SQUARE_SIZE);
    text.setAttributeNS(null, "font-family", "sans-serif");
    text.setAttributeNS(null, "font-size", "" + (this.LEGEND_HEIGHT / 4));
    this.svg?.appendChild(text);
  }
  _drawDay(x: any, y: any, color: any, day: any, nbr_seconds: any, v: any) {
    const g = document.createElementNS(this.ns, "g");
    const rect = document.createElementNS(this.ns, "rect");
    const logtime =
      nbr_seconds >= this.max
        ? "24h00"
        : v.hour() + "h" + (v.minutes() < 10 ? "0" : "") + v.minutes();
    rect.setAttributeNS(null, "x", x);
    rect.setAttributeNS(null, "y", y + this.LEGEND_HEIGHT);
    rect.setAttributeNS(null, "width", "" + this.SQUARE_SIZE);
    rect.setAttributeNS(null, "height", "" + this.SQUARE_SIZE);
    rect.setAttributeNS(null, "stroke", "#ffffff00");
    rect.setAttributeNS(null, "stroke-width", "2");
    rect.setAttributeNS(null, "fill", color);
    rect.setAttributeNS(null, "data-toggle", "tooltip");
    rect.setAttributeNS(null, "data-original-title", logtime);
    g.setAttributeNS(null, "data-toggle", "tooltip");
    g.setAttributeNS(null, "data-original-title", logtime);
    g.appendChild(rect);
    const text = document.createElementNS(this.ns, "text");
    text.innerHTML = "" + day;
    text.setAttributeNS(null, "x", x + (this.SQUARE_SIZE / 4));
    text.setAttributeNS(
      null,
      "y",
      y + this.LEGEND_HEIGHT + this.SQUARE_SIZE / 2 + 2
    );
    text.setAttributeNS(
      null,
      "fill",
      color == this.BG_COLOR ? "#eee" : "#eee"
    );
    text.setAttributeNS(null, "width", "" + this.SQUARE_SIZE);
    text.setAttributeNS(null, "height", "" + this.SQUARE_SIZE);
    text.setAttributeNS(null, "font-family", "sans-serif");
    text.setAttributeNS(null, "font-size", "" + (this.SQUARE_SIZE / 2));
    text.setAttributeNS(null, "pointer-events", "none");
    g.appendChild(text);

    this.svg?.appendChild(g);
  }
}


