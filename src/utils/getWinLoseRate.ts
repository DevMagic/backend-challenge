import { apiLeague } from "@config/axios";

import { AppError } from "@shared/errors/AppError";

interface IResponse {
  wins: number;
  losses: number;
}

export default async function getWinLoseRate(
  summonerId: string
): Promise<IResponse> {
  const data = await apiLeague
    .get(`/${summonerId}`)
    .then((response) => response.data)
    .catch((err) => {
      throw new AppError(`Something went wrong: ${err}`);
    });

  const response: IResponse = data.reduce(
    (acc, operation) => {
      return {
        wins: acc.wins + operation.wins || acc.wins,
        losses: acc.losses + operation.losses || acc.losses,
      };
    },
    { wins: 0, losses: 0 }
  );

  return response;
}
