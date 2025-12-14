use anchor_lang::prelude::*;

declare_id!("EntryPassProgram11111111111111111111111111");

#[program]
pub mod entry_pass {
    use super::*;

    pub fn create_pass_collection(
        ctx: Context<CreatePassCollection>,
        name: String,
        description: String,
        price: u64,
        max_supply: u64,
        validity_period: i64,
    ) -> Result<()> {
        let pass_collection = &mut ctx.accounts.pass_collection;
        let clock = Clock::get()?;

        pass_collection.organizer = ctx.accounts.organizer.key();
        pass_collection.name = name;
        pass_collection.description = description;
        pass_collection.price = price;
        pass_collection.max_supply = max_supply;
        pass_collection.current_supply = 0;
        pass_collection.validity_period = validity_period;
        pass_collection.created_at = clock.unix_timestamp;
        pass_collection.bump = ctx.bumps.pass_collection;

        Ok(())
    }

    pub fn purchase_pass(ctx: Context<PurchasePass>) -> Result<()> {
        let pass_collection = &mut ctx.accounts.pass_collection;
        let user_pass = &mut ctx.accounts.user_pass;
        let clock = Clock::get()?;

        require!(
            pass_collection.current_supply < pass_collection.max_supply,
            ErrorCode::MaxSupplyReached
        );

        // Transfer SOL from buyer to organizer
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.buyer.key(),
            &pass_collection.organizer,
            pass_collection.price,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.buyer.to_account_info(),
                ctx.accounts.organizer.to_account_info(),
            ],
        )?;

        user_pass.owner = ctx.accounts.buyer.key();
        user_pass.pass_collection = pass_collection.key();
        user_pass.purchased_at = clock.unix_timestamp;
        user_pass.expires_at = if pass_collection.validity_period > 0 {
            clock.unix_timestamp + pass_collection.validity_period
        } else {
            i64::MAX
        };
        user_pass.is_active = true;
        user_pass.bump = ctx.bumps.user_pass;

        pass_collection.current_supply += 1;

        Ok(())
    }

    pub fn verify_pass(ctx: Context<VerifyPass>) -> Result<bool> {
        let user_pass = &ctx.accounts.user_pass;
        let clock = Clock::get()?;

        let is_valid = user_pass.is_active
            && user_pass.owner == ctx.accounts.owner.key()
            && (user_pass.expires_at == i64::MAX || clock.unix_timestamp < user_pass.expires_at);

        Ok(is_valid)
    }

    pub fn revoke_pass(ctx: Context<RevokePass>) -> Result<()> {
        let user_pass = &mut ctx.accounts.user_pass;
        user_pass.is_active = false;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreatePassCollection<'info> {
    #[account(
        init,
        payer = organizer,
        space = 8 + PassCollection::INIT_SPACE,
        seeds = [b"pass-collection", organizer.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub pass_collection: Account<'info, PassCollection>,
    #[account(mut)]
    pub organizer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PurchasePass<'info> {
    #[account(mut)]
    pub pass_collection: Account<'info, PassCollection>,
    #[account(
        init,
        payer = buyer,
        space = 8 + UserPass::INIT_SPACE,
        seeds = [b"user-pass", pass_collection.key().as_ref(), buyer.key().as_ref()],
        bump
    )]
    pub user_pass: Account<'info, UserPass>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    /// CHECK: This is the organizer who will receive payment
    #[account(mut)]
    pub organizer: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VerifyPass<'info> {
    pub user_pass: Account<'info, UserPass>,
    /// CHECK: This is the wallet being verified
    pub owner: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct RevokePass<'info> {
    #[account(
        mut,
        has_one = pass_collection,
    )]
    pub user_pass: Account<'info, UserPass>,
    #[account(
        has_one = organizer
    )]
    pub pass_collection: Account<'info, PassCollection>,
    pub organizer: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct PassCollection {
    pub organizer: Pubkey,
    #[max_len(50)]
    pub name: String,
    #[max_len(200)]
    pub description: String,
    pub price: u64,
    pub max_supply: u64,
    pub current_supply: u64,
    pub validity_period: i64,
    pub created_at: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct UserPass {
    pub owner: Pubkey,
    pub pass_collection: Pubkey,
    pub purchased_at: i64,
    pub expires_at: i64,
    pub is_active: bool,
    pub bump: u8,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Maximum supply reached for this pass collection")]
    MaxSupplyReached,
}
