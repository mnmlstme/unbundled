import { Async, Auth } from "@un-/bundled";
import { Model } from "./model";
import { Message } from "./message";
import { Traveler } from "server/models";

type Command = ["profile/load", { profile: Traveler }];

export function update(
  model: Model,
  message: Message | Command,
  auth: Auth.Model
): Model | Async<Model, Command> {
  const [type, payload] = message;
  switch (type) {
    case "profile/request":
      if (model.profile?.userid === payload.userid) break;
      return [
        {
          ...model,
          profile: {
            userid: payload.userid,
            name: "?",
            home: "?",
            airports: [],
          }
        },
        requestProfile(payload, auth)
      ];
    case "profile/save":
      return [model,
        saveProfile(payload, auth)
      ];
    case "profile/load":
      const { profile } = payload;
      return { ...model, profile };
    default:
      const invalidType: never = type;
      console.log("Invalid message type:", invalidType);
  }
}

function requestProfile(
  payload: { userid: string },
  auth: Auth.Model
): Promise<Command> {
  return fetch(`/api/travelers/${payload.userid}`, {
    headers: Auth.headers(auth)
  })
    .then((response: Response) => {
      if (response.status !== 200) throw `HTTP Status ${response.status}`;
      return response.json();
    })
    .then((json: object) =>
      ["profile/load", { profile: json as Traveler }]
    );
}

function saveProfile(
  payload: { userid: string, profile: Traveler },
  user: Auth.Model
) {
  return fetch(`/api/travelers/${payload.userid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(payload.profile)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      else
        throw new Error(
          `Failed to save profile for ${payload.userid}`
        );
    })
    .then((json: object) =>
      ["profile/load", { profile: json as Traveler }]);
}
