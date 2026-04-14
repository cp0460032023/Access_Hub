import { Injectable } from '@nestjs/common';
import { AbilityBuilder, PureAbility, AbilityClass } from '@casl/ability';
import { User, Role } from '../users/entities/user.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type AppAbility = PureAbility<[Action, string]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      PureAbility as AbilityClass<AppAbility>,
    );

    if (user.role === Role.ADMIN) {
      can(Action.Manage, 'all');
    } else if (user.role === Role.EDITOR) {
      can(Action.Read, 'User');
      can(Action.Update, 'User');
      cannot(Action.Delete, 'User');
      cannot(Action.Create, 'User');
      can(Action.Manage, 'Profile');
    } else if (user.role === Role.VIEWER) {
      can(Action.Read, 'Profile');
      can(Action.Update, 'Profile');
      cannot(Action.Read, 'User');
      cannot(Action.Create, 'User');
      cannot(Action.Update, 'User');
      cannot(Action.Delete, 'User');
    }

    return build();
  }
}